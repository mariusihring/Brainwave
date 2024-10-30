use async_graphql::*;
use chrono::{NaiveTime, Weekday};
use serde::{Deserialize, Serialize};

#[derive(Debug, Copy, Clone, Serialize, Deserialize, PartialEq, Eq, Enum)]
pub enum WeekdayEnum {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday,
}

impl ToString for WeekdayEnum {
    fn to_string(&self) -> String {
        match self {
            WeekdayEnum::Monday => "Monday".to_string(),
            WeekdayEnum::Tuesday => "Tuesday".to_string(),
            WeekdayEnum::Wednesday => "Wednesday".to_string(),
            WeekdayEnum::Thursday => "Thursday".to_string(),
            WeekdayEnum::Friday => "Friday".to_string(),
            WeekdayEnum::Saturday => "Saturday".to_string(),
            WeekdayEnum::Sunday => "Sunday".to_string(),
        }
    }
}
impl From<Weekday> for WeekdayEnum {
    fn from(weekday: Weekday) -> Self {
        match weekday {
            Weekday::Mon => WeekdayEnum::Monday,
            Weekday::Tue => WeekdayEnum::Tuesday,
            Weekday::Wed => WeekdayEnum::Wednesday,
            Weekday::Thu => WeekdayEnum::Thursday,
            Weekday::Fri => WeekdayEnum::Friday,
            Weekday::Sat => WeekdayEnum::Saturday,
            Weekday::Sun => WeekdayEnum::Sunday,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize,  SimpleObject)]
pub struct RecurringAppointment {
    pub name: String,
    pub weekday: WeekdayEnum,
    pub start_time: NaiveTime,
    pub end_time: NaiveTime,
    pub location: String,
}
