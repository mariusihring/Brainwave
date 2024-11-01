// src/graphql/calendar/helper_functions.rs

use crate::error::Error;
use crate::models::_entities::{
    appointments, appointments::Entity as AppointmentEntity, semesters,
    semesters::Entity as SemesterEntity, settings, settings::Entity as SettingsEntity, users,
    users::Entity as UserEntity,
};
use chrono::{Datelike, Duration, NaiveDate, NaiveTime, Weekday};
use log::{debug, warn};
use regex::Regex;
use reqwest::Client;
use scraper::{Html, Selector};
use sea_orm::{ColumnTrait, DatabaseTransaction, EntityTrait, ModelTrait, QueryFilter, Set};
use std::collections::HashMap;
use url::Url;
use uuid::Uuid;

use super::mutation::{RecurringAppointment, WeekdayEnum};

/// Struct representing a calendar appointment.
#[derive(Debug, Clone)]
pub struct Appointment {
    pub id: String,            // UUID v4 as String
    pub date: NaiveDate,       // Date of the appointment
    pub name: String,          // Name of the appointment
    pub start_time: NaiveTime, // Start time
    pub end_time: NaiveTime,   // End time
    pub location: String,      // Location of the appointment
}

/// Processes a calendar link by modifying its query parameters.
///
/// Specifically, it replaces `day`, `month`, and `year` parameters with placeholders.
///
/// # Arguments
///
/// * `link` - The original calendar link.
///
/// # Returns
///
/// * A processed calendar link as a `String`.
pub fn process_calendar_link(link: &str) -> String {
    let mut url = match Url::parse(link) {
        Ok(url) => url,
        Err(_) => return link.to_string(),
    };

    {
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
    }

    url.to_string()
}

/// Converts a month abbreviation to its corresponding month number.
///
/// # Arguments
///
/// * `month_abbr` - A string slice representing the month abbreviation.
///
/// # Returns
///
/// * `Option<u32>` representing the month number if the abbreviation is recognized.
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

/// Generates all Mondays between `start_date` and `end_date`.
///
/// # Arguments
///
/// * `start_date` - The starting `NaiveDate`.
/// * `end_date` - The ending `NaiveDate`.
///
/// # Returns
///
/// * A vector of `NaiveDate` representing each Monday within the range.
pub fn generate_weeks(start_date: NaiveDate, end_date: NaiveDate) -> Vec<NaiveDate> {
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

/// Generates a fetch link by replacing placeholders with actual date values.
///
/// # Arguments
///
/// * `calendar_link` - The processed calendar link with placeholders.
/// * `week_start` - The `NaiveDate` representing the start of the week.
///
/// # Returns
///
/// * A `String` representing the final fetch link.
pub fn generate_fetch_link(calendar_link: &str, week_start: NaiveDate) -> String {
    calendar_link
        .replace("@1", &week_start.format("%d").to_string())
        .replace("@2", &week_start.format("%m").to_string())
        .replace("@3", &week_start.format("%Y").to_string())
}

/// Fetches all semesters for a user using SeaORM.
///
/// # Arguments
///
/// * `txn` - The active database transaction.
/// * `user_id` - The ID of the user.
///
/// # Returns
///
/// * `Result<Vec<semester::Model>, Error>` containing the list of semesters or an error.
pub async fn fetch_all_semesters_seaorm(
    txn: &DatabaseTransaction,
    user_id: i32,
) -> Result<Vec<semesters::Model>, Error> {
    let semesters = SemesterEntity::find()
        .filter(semesters::Column::UserId.eq(user_id))
        .all(txn)
        .await
        .map_err(|e| Error::new(e.to_string()))?;

    Ok(semesters)
}

/// Fetches the calendar link for a user using SeaORM.
///
/// # Arguments
///
/// * `txn` - The active database transaction.
/// * `user_id` - The ID of the user.
///
/// # Returns
///
/// * `Result<String, Error>` containing the calendar link or a default empty string.
pub async fn fetch_calendar_link_seaorm(
    txn: &DatabaseTransaction,
    user_id: i32,
) -> Result<String, Error> {
    let settings = SettingsEntity::find()
        .filter(settings::Column::UserId.eq(user_id))
        .one(txn)
        .await
        .map_err(|e| Error::new(e.to_string()))?;

    Ok(settings.and_then(|s| s.calendar_link).unwrap_or_default())
}

/// Inserts multiple appointments into the database using SeaORM.
///
/// This function converts each `Appointment` into an `ActiveModel` and performs a bulk insert.
///
/// # Arguments
///
/// * `txn` - The active database transaction.
/// * `user` - The user performing the operation.
/// * `appointments` - A slice of `Appointment` to be inserted.
///
/// # Returns
///
/// * `Result` indicating success or containing an `Error`.
pub async fn insert_appointments_seaorm(
    txn: &DatabaseTransaction,
    user: users::Model,
    appointments: &[Appointment],
) -> Result<(), Error> {
    // Prepare a vector to hold all active models for bulk insertion.
    let active_models: Vec<appointments::ActiveModel> = appointments
        .iter()
        .map(|appointment| appointments::ActiveModel {
            id: Set(appointment.id.clone()),
            date: Set(appointment.date),
            title: Set(appointment.name.clone()),
            start_time: Set(appointment.start_time),
            end_time: Set(appointment.end_time),
            location: Set(appointment.location.clone()),
            user_id: Set(user.id),
            // Set other fields if necessary.
            ..Default::default()
        })
        .collect();

    // Perform a bulk insert of all appointments within the transaction.
    AppointmentEntity::insert_many(active_models)
        .exec(txn)
        .await
        .map_err(|e| Error::new(e.to_string()))?;

    Ok(())
}

/// Fetches appointments from an external DHBW calendar link.
///
/// # Arguments
///
/// * `fetch_link` - The URL to fetch appointments from.
///
/// # Returns
///
/// * `Result<Vec<Appointment>, Error>` containing the list of appointments or an error.
pub async fn fetch_calendar_from_dhbw(fetch_link: &str) -> Result<Vec<Appointment>, Error> {
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

    let table = match document.select(&table_selector).next() {
        Some(table) => table,
        None => {
            warn!("No table.week_table found in the fetched document.");
            return Ok(appointments);
        }
    };

    let re = Regex::new(r"(\d{2}:\d{2})\s*-(\d{2}:\d{2})(.+)").unwrap();
    let mut current_date = None;

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
            for (cell_index, cell) in cells.iter().enumerate() {
                if let Some(class) = cell.value().attr("class") {
                    if class.contains("week_block") {
                        // Update current_date based on the cell's position
                        if let Some(base_date) = current_date {
                            let days_to_add = (cell_index / 3) as i64; // Assuming 3 cells per day
                            let appointment_date = base_date + Duration::days(days_to_add);

                            // Parse appointment details.
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
                                        let appointment = Appointment {
                                            id: Uuid::new_v4().to_string(),
                                            date: appointment_date,
                                            name: name.to_string(),
                                            start_time: appointment_date.and_time(start),
                                            end_time: appointment_date.and_time(end),
                                            location,
                                        };
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

/// Processes raw appointments into recurring appointments.
///
/// Groups appointments by name and identifies recurring patterns.
///
/// # Arguments
///
/// * `appointments` - A vector of `Appointment` objects.
///
/// # Returns
///
/// * A vector of `RecurringAppointment` objects.
pub fn process_recurring_appointments(appointments: Vec<Appointment>) -> Vec<RecurringAppointment> {
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

            if events
                .iter()
                .all(|e| e.name == name && !e.name.contains("Klausur"))
            {
                let new_weekday: WeekdayEnum = weekday.into();
                // Create a recurring appointment.
                recurring_appointments.push(RecurringAppointment {
                    name,
                    weekday: new_weekday,
                    start_time: start_time.time(),
                    end_time: end_time.time(),
                    location: first_event.location.clone(),
                });
            }
        }
    }

    recurring_appointments
}
