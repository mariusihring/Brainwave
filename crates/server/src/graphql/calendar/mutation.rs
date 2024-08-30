use async_graphql::*;
use chrono::NaiveDate;
use regex::Regex;
use reqwest::Client;
use scraper::{Html, Selector};
use sqlx::{Pool, Sqlite};
use ::types::user::DatabaseUser;

use crate::graphql::calendar::CalendarMutation;

#[Object]
impl CalendarMutation {
    pub async fn fetch_calendar_from_dhbw(&self, ctx: &Context<'_>, fetch_link: String) -> Result<Vec<String>> {
        let mut results: Vec<String> = Vec::new();
        let user = ctx.data::<DatabaseUser>().unwrap();
        let db = ctx.data::<Pool<Sqlite>>().unwrap();
        
        let client = Client::new();
        let res = client.get(&fetch_link)  
            .send()
            .await?
            .text()
            .await?;
    
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
                                        results.push(format!("Date: {}, Name: {}, Start Time: {}, End Time: {}, Location: {}",
                                                 date, name, start_time, end_time, location));
                                    } else {
                                        println!(
                                            "Warning: No current date set for appointment: {}",
                                            name
                                        );
                                    }
                                } else {
                                    println!("Warning: Could not parse appointment text: {}", text);
                                }
                            } else {
                                println!("Warning: No link found in week_block");
                            }
                        }
                    }
                }
            }
        }
    
        Ok(results)
        
    }
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