use ::types::{
    calendar::Appointment,
    recurring_appointment::{RecurringAppointment, WeekdayEnum},
    semester::Semester,
    settings::Settings,
    user::DatabaseUser,
};
use async_graphql::*;
use chrono::{Datelike, Duration, NaiveDate, NaiveTime, Weekday};
use log::{debug, warn};
use regex::Regex;
use reqwest::Client;
use scraper::{Html, Selector};
use sqlx::{Pool, Sqlite};
use std::collections::HashMap;
use url::Url;
use uuid::Uuid;

use crate::graphql::calendar::CalendarMutation;

#[Object]
impl CalendarMutation {
    pub async fn upsert_calendar_link(
        &self,
        ctx: &Context<'_>,
        calendar_link: Option<String>,
    ) -> Result<Settings> {
        let user = ctx.data::<DatabaseUser>()?;
        let db = ctx.data::<Pool<Sqlite>>()?;

        let processed_link = calendar_link.map(|link| process_calendar_link(&link));

        let mut tx = db.begin().await?;

        let existing_settings =
            sqlx::query_as::<_, Settings>("SELECT * FROM settings WHERE user_id = ?")
                .bind(&user.id)
                .fetch_optional(&mut tx)
                .await?;

        let settings = match existing_settings {
            Some(mut settings) => {
                settings.calendar_link = processed_link;
                sqlx::query("UPDATE settings SET calendar_link = ? WHERE user_id = ?")
                    .bind(&settings.calendar_link)
                    .bind(&user.id)
                    .execute(&mut tx)
                    .await?;
                settings
            }
            None => {
                let id = uuid::Uuid::new_v4().to_string();
                let new_settings = Settings {
                    id,
                    user_id: user.id.clone(),
                    calendar_link: processed_link,
                };
                sqlx::query("INSERT INTO settings (id, user_id, calendar_link) VALUES (?, ?, ?)")
                    .bind(&new_settings.id)
                    .bind(&new_settings.user_id)
                    .bind(&new_settings.calendar_link)
                    .execute(&mut tx)
                    .await?;
                new_settings
            }
        };

        tx.commit().await?;

        Ok(settings)
    }

    pub async fn process_semester_calendar(
        &self,
        ctx: &Context<'_>,
        semester_id: ID,
    ) -> Result<Vec<RecurringAppointment>> {
        let db = ctx.data::<Pool<Sqlite>>()?;
        let user = ctx.data::<DatabaseUser>()?;

        let semester = fetch_semester(db, &semester_id).await?;
        let calendar_link = fetch_calendar_link(db, &user.id).await?;
        let weeks = generate_weeks(semester.start_date, semester.end_date);
        let mut all_appointments = Vec::new();

        for week_start in weeks {
            let fetch_link = generate_fetch_link(&calendar_link, week_start);

            let appointments = fetch_calendar_from_dhbw(&fetch_link).await?;
            all_appointments.extend(appointments);
        }

        insert_appointments(db, user.clone(), &all_appointments).await?;

        update_semester_import_status(db, &semester_id).await?;

        let recurring_appointments = process_recurring_appointments(all_appointments);

        Ok(recurring_appointments)
    }
}

async fn insert_appointments(
    db: &Pool<Sqlite>,
    user: DatabaseUser,
    appointments: &[Appointment],
) -> Result<()> {
    let mut tx = db.begin().await?;

    for appointment in appointments {
        sqlx::query(
            r#"
            INSERT INTO appointment (id, date, name, start_time, end_time, location, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(appointment.id.clone())
        .bind(appointment.date.clone())
        .bind(appointment.name.clone())
        .bind(appointment.start_time.clone())
        .bind(appointment.end_time.clone())
        .bind(appointment.location.clone())
        .bind(user.id.clone())
        .execute(&mut tx)
        .await?;
    }

    tx.commit().await?;
    Ok(())
}

async fn update_semester_import_status(db: &Pool<Sqlite>, semester_id: &ID) -> Result<()> {
    sqlx::query(
        r#"
        UPDATE semester
        SET imported_appointments = TRUE
        WHERE id = ?
        "#,
    )
    .bind(semester_id.to_string())
    .execute(db)
    .await?;

    Ok(())
}

fn process_calendar_link(link: &str) -> String {
    let mut url = match Url::parse(link) {
        Ok(url) => url,
        Err(_) => return link.to_string(),
    };

    let mut query_pairs = url.query_pairs_mut();
    query_pairs.clear();

    for (key, value) in Url::parse(link).unwrap().query_pairs() {
        match key.as_ref() {
            "day" => query_pairs.append_pair("day", "@1"),
            "month" => query_pairs.append_pair("month", "@2"),
            "year" => query_pairs.append_pair("year", "@3"),
            _ => query_pairs.append_pair(&key, &value),
        };
    }

    drop(query_pairs);
    url.to_string()
}

fn get_month_number(month_abbr: &str) -> Option<u32> {
    match month_abbr.to_lowercase().as_str() {
        "jan" => Some(1),
        "feb" => Some(2),
        "mär" | "mar" => Some(3),
        "apr" => Some(4),
        "mai" | "may" => Some(5),
        "jun" => Some(6),
        "jul" => Some(7),
        "aug" => Some(8),
        "sep" => Some(9),
        "okt" | "oct" => Some(10),
        "nov" => Some(11),
        "dez" | "dec" => Some(12),
        _ => None,
    }
}

fn generate_weeks(start_date: NaiveDate, end_date: NaiveDate) -> Vec<NaiveDate> {
    let mut weeks = Vec::new();
    let mut current_date = start_date;

    while current_date <= end_date {
        if current_date.weekday() == Weekday::Mon {
            weeks.push(current_date);
        }
        current_date += Duration::days(1);
    }

    weeks
}

fn generate_fetch_link(calendar_link: &str, week_start: NaiveDate) -> String {
    calendar_link
        .replace("%401", &week_start.format("%d").to_string())
        .replace("%402", &week_start.format("%m").to_string())
        .replace("%403", &week_start.format("%Y").to_string())
}

async fn fetch_semester(db: &Pool<Sqlite>, semester_id: &ID) -> Result<Semester> {
    let semester = sqlx::query_as::<_, Semester>("SELECT * FROM semester WHERE id = ?")
        .bind(semester_id.to_string())
        .fetch_one(db)
        .await?;

    Ok(semester)
}

async fn fetch_calendar_link(db: &Pool<Sqlite>, user_id: &str) -> Result<String> {
    let settings = sqlx::query_as::<_, Settings>("SELECT * FROM settings WHERE user_id = ?")
        .bind(user_id)
        .fetch_one(db)
        .await?;

    Ok(settings.calendar_link.unwrap_or_default())
}

async fn fetch_calendar_from_dhbw(fetch_link: &str) -> Result<Vec<Appointment>> {
    let mut appointments: Vec<Appointment> = Vec::new();
    debug!("Starting fetch_calendar_from_dhbw");

    let client = Client::new();
    let res = client.get(fetch_link).send().await?.text().await?;

    let document = Html::parse_document(&res);
    let table_selector = Selector::parse("table.week_table").unwrap();
    let row_selector = Selector::parse("tr").unwrap();
    let cell_selector = Selector::parse("td").unwrap();
    let link_selector = Selector::parse("a").unwrap();
    let resource_selector = Selector::parse("span.resource").unwrap();

    let table = document.select(&table_selector).next().unwrap();
    let mut current_date = None;

    let re = Regex::new(r"(\d{2}:\d{2})\s*-(\d{2}:\d{2})(.+)").unwrap();

    for row in table.select(&row_selector) {
        let cells: Vec<_> = row.select(&cell_selector).collect();

        if cells.is_empty() {
            continue;
        }

        if cells[0].value().attr("class") == Some("week_header") {
            let date_text = cells[0].text().collect::<String>();
            if date_text.contains('.') {
                let parts: Vec<&str> = date_text.split_whitespace().collect();
                if parts.len() >= 2 {
                    let date_parts: Vec<&str> = parts[1].split('.').collect();
                    if date_parts.len() >= 2 {
                        let day: u32 = date_parts[0].parse().unwrap_or(1);
                        let month: u32 = date_parts[1]
                            .parse()
                            .unwrap_or_else(|_| get_month_number(date_parts[1]).unwrap_or(1));

                        current_date = NaiveDate::from_ymd_opt(2024, month, day);
                    }
                }
            }
        } else {
            for cell in cells {
                if let Some(class) = cell.value().attr("class") {
                    if class.contains("week_block") {
                        if let Some(link) = cell.select(&link_selector).next() {
                            let text = link.text().collect::<String>();

                            if let Some(captures) = re.captures(&text) {
                                let start_time = captures.get(1).unwrap().as_str();
                                let end_time = captures.get(2).unwrap().as_str();
                                let name = captures.get(3).unwrap().as_str().trim();

                                let location = cell
                                    .select(&resource_selector)
                                    .map(|span| span.text().collect::<String>())
                                    .collect::<Vec<String>>()
                                    .join(", ");

                                if let Some(date) = current_date {
                                    if let (Ok(start), Ok(end)) = (
                                        NaiveTime::parse_from_str(start_time, "%H:%M"),
                                        NaiveTime::parse_from_str(end_time, "%H:%M"),
                                    ) {
                                        let appointment = Appointment {
                                            id: Uuid::new_v4().to_string(),
                                            date,
                                            name: name.to_string(),
                                            start_time: date.and_time(start),
                                            end_time: date.and_time(end),
                                            location,
                                        };
                                        appointments.push(appointment);
                                    } else {
                                        warn!("Failed to parse time for appointment: {}", name);
                                    }
                                } else {
                                    warn!("No current date set for appointment: {}", name);
                                }
                            } else {
                                warn!("Could not parse appointment text: {}", text);
                            }
                        } else {
                            warn!("No link found in week_block");
                        }
                    }
                }
            }
        }
    }

    debug!(
        "Finished parsing calendar. Found {} appointments.",
        appointments.len()
    );
    Ok(appointments)
}

fn process_recurring_appointments(appointments: Vec<Appointment>) -> Vec<RecurringAppointment> {
    let mut event_map: HashMap<String, Vec<Appointment>> = HashMap::new();

    for appointment in appointments {
        event_map
            .entry(appointment.name.clone())
            .or_insert_with(Vec::new)
            .push(appointment);
    }

    let mut recurring_appointments = Vec::new();

    for (name, events) in event_map {
        if events.len() > 1 {
            let first_event = &events[0];
            let weekday = first_event.date.weekday();
            let start_time = first_event.start_time;
            let end_time = first_event.end_time;

            if events.iter().all(|e| {
                e.date.weekday() == weekday && e.start_time == start_time && e.end_time == end_time
            }) {
                let new_weekday: WeekdayEnum = weekday.into();
                recurring_appointments.push(RecurringAppointment {
                    name,
                    weekday: new_weekday,
                    start_time,
                    end_time,
                    location: first_event.location.clone(),
                });
            }
        }
    }

    recurring_appointments
}
