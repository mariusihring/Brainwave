use chrono::{Datelike, Duration, NaiveDate, NaiveTime, Weekday, Local};
use log::{debug, warn};
use regex::Regex;
use reqwest::Client;
use scraper::{Html, Selector};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set};
use std::collections::HashMap;
use url::Url;
use uuid::Uuid;

use crate::models::{
    _entities::{
        appointment::{self, Model as Appointment},
        semester, settings,
    },
    recurring_appointment::{RecurringAppointment, WeekdayEnum},
};

pub fn process_calendar_link(link: &str) -> String {
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

pub fn get_month_number(month_abbr: &str) -> Option<u32> {
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

pub fn generate_weeks(start_date: NaiveDate, end_date: NaiveDate) -> Vec<NaiveDate> {
    let mut weeks = Vec::new();
    let mut current_date = start_date;

    debug!("Current_date: {}, end_date: {}", current_date, end_date);
    while current_date <= end_date {
        if current_date.weekday() == Weekday::Mon {
            weeks.push(current_date);
        }
        current_date += Duration::days(1);
    }

    weeks
}

pub fn generate_fetch_link(calendar_link: &str, week_start: NaiveDate) -> String {
    calendar_link
        .replace("%401", &week_start.format("%d").to_string())
        .replace("%402", &week_start.format("%m").to_string())
        .replace("%403", &week_start.format("%Y").to_string())
}

pub async fn fetch_semester(
    db: &DatabaseConnection,
    semester_id: &str,
) -> Result<semester::Model, sea_orm::DbErr> {
    semester::Entity::find_by_id(Uuid::parse_str(semester_id).unwrap())
        .one(db)
        .await?
        .ok_or(sea_orm::DbErr::RecordNotFound(
            "Semester not found".to_string(),
        ))
}

pub async fn fetch_calendar_link(
    db: &DatabaseConnection,
    user_id: uuid::Uuid,
) -> Result<String, sea_orm::DbErr> {
    let settings = settings::Entity::find()
        .filter(settings::Column::UserId.eq(user_id))
        .one(db)
        .await?
        .ok_or(sea_orm::DbErr::RecordNotFound(
            "Settings not found".to_string(),
        ))?;
    Ok(settings.calendar_link.unwrap_or_default())
}

pub async fn fetch_calendar_from_dhbw(
    fetch_link: &str,
    user_id: uuid::Uuid,
) -> Result<Vec<appointment::ActiveModel>, Box<dyn std::error::Error>> {
    let mut appointments: Vec<appointment::ActiveModel> = Vec::new();
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

    let re = Regex::new(r"(\d{2}:\d{2})\s*-(\d{2}:\d{2})(.+)").unwrap();
    let mut current_date = None;

    for row in table.select(&row_selector) {
        let cells: Vec<_> = row.select(&cell_selector).collect();

        if cells.is_empty() {
            warn!("No cells");
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

                        current_date = NaiveDate::from_ymd_opt(Local::now().year(), month, day);
                    }
                }
            }
        } else {
            for (cell_index, cell) in cells.iter().enumerate() {
                if let Some(class) = cell.value().attr("class") {
                    if class.contains("week_block") {
                        if let Some(base_date) = current_date {
                            let days_to_add = (cell_index / 3) as i64; // Assuming 3 cells per day
                            let appointment_date = base_date + Duration::days(days_to_add);

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

                                    if let (Ok(start), Ok(end)) = (
                                        NaiveTime::parse_from_str(start_time, "%H:%M"),
                                        NaiveTime::parse_from_str(end_time, "%H:%M"),
                                    ) {
                                        let appointment = appointment::ActiveModel {
                                            id: Set(Uuid::new_v4()),
                                            date: Set(appointment_date),
                                            title: Set(name.to_string()),
                                            start_time: Set(appointment_date.and_time(start)),
                                            end_time: Set(appointment_date.and_time(end)),
                                            //TODO: make this proper Some none action
                                            location: Set(Some(location)),
                                            is_canceled: Set(false),
                                            user_id: Set(user_id),
                                            course_id: Set(None),
                                        };
                                        debug!("{:?}", appointment);
                                        appointments.push(appointment);
                                    } else {
                                        warn!("Failed to parse time for appointment: {}", name);
                                    }
                                } else {
                                    warn!("Could not parse appointment text: {}", text);
                                }
                            } else {
                                warn!("No link found in week_block");
                            }
                        } else {
                            warn!("No current date set for appointment");
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

pub fn process_recurring_appointments(appointments: Vec<Appointment>) -> Vec<RecurringAppointment> {
    let mut event_map: HashMap<String, Vec<Appointment>> = HashMap::new();

    for appointment in appointments {
        event_map
            .entry(appointment.title.clone())
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

            if events
                .iter()
                .all(|e| e.title == name && !e.title.contains("Klausur"))
            {
                let new_weekday: WeekdayEnum = weekday.into();
                recurring_appointments.push(RecurringAppointment {
                    name,
                    weekday: new_weekday,
                    start_time: start_time.time(),
                    end_time: end_time.time(),
                    location: first_event.location.clone().unwrap(),
                });
            }
        }
    }

    recurring_appointments
}

pub async fn fetch_all_semesters(
    db: &DatabaseConnection,
    user_id: uuid::Uuid,
) -> Result<Vec<semester::Model>, sea_orm::DbErr> {
    semester::Entity::find()
        .filter(semester::Column::UserId.eq(user_id))
        .all(db)
        .await
}
