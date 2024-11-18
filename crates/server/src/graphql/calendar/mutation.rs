
use async_graphql::*;

use sea_orm::QueryFilter;
use sea_orm::{
    prelude::Uuid, ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, IntoActiveModel,
    Set, TransactionTrait,
};
use url::Url;

use crate::graphql::calendar::CalendarMutation;

use crate::models::_entities::{appointment, semester, settings, user};
use crate::models::recurring_appointment::RecurringAppointment;

use super::helper_functions::{
    fetch_all_semesters, fetch_calendar_from_dhbw, fetch_calendar_link, generate_fetch_link,
    generate_weeks, process_recurring_appointments,
};

#[Object]
impl CalendarMutation {
    pub async fn upsert_calendar_link(
        &self,
        ctx: &Context<'_>,
        calendar_link: Option<String>,
    ) -> Result<settings::Model> {
        let user = ctx.data::<user::Model>()?;
        let db = ctx.data::<DatabaseConnection>()?;

        let processed_link = calendar_link.map(|link| process_calendar_link(&link));

        let txn = db.begin().await?;

        let existing_settings = settings::Entity::find()
            .filter(settings::Column::UserId.eq(user.id))
            .one(&txn)
            .await?;

        let settings = match existing_settings {
            Some(existing_settings) => {
                // Convert the `Model` instance to an `ActiveModel`
                let mut active_settings = existing_settings.into_active_model();
                active_settings.calendar_link = Set(processed_link);

                // Perform the update
                active_settings.update(&txn).await?
            }
            None => {
                let new_settings = settings::ActiveModel {
                    id: Set(Uuid::new_v4()),
                    user_id: Set(user.id),
                    calendar_link: Set(processed_link.clone()),
                };
                new_settings.insert(&txn).await?
            }
        };

        txn.commit().await?;

        Ok(settings)
    }

    pub async fn process_semester_calendar(
        &self,
        ctx: &Context<'_>,
        semester_id: String,
    ) -> Result<Vec<RecurringAppointment>> {
        let db = ctx.data::<DatabaseConnection>()?;
        let user = ctx.data::<&user::Model>()?;

        let semesters = fetch_all_semesters(&db, user.id.to_string().as_str()).await?;

        let current_semester = semesters
            .into_iter()
            .find(|semester| semester.id == Uuid::parse_str(semester_id.as_str()).unwrap());

        let semester = match current_semester {
            Some(semester) => semester,
            None => return Err("You are not currently in a semester timeframe".into()),
        };

        if semester.imported_appointments {
            return Err("The calendar for this semester has already been imported".into());
        }

        let calendar_link = fetch_calendar_link(&db, user.id.to_string().as_str()).await?;
        let weeks = generate_weeks(semester.start_date, semester.end_date);
        let mut all_appointments = Vec::new();

        for week_start in weeks {
            let fetch_link = generate_fetch_link(&calendar_link, week_start);
            let appointments = fetch_calendar_from_dhbw(&fetch_link)
                .await
                .expect("failed to fetch calendar from dhbw");
            all_appointments.extend(appointments);
        }

        let apps = insert_appointments(&db,  &all_appointments).await?;

        update_semester_import_status(&db, &semester.id.to_string()).await?;

        let recurring_appointments = process_recurring_appointments(apps);

        Ok(recurring_appointments)
    }
}

async fn insert_appointments(
    db: &DatabaseConnection,
    appointments: &Vec<appointment::ActiveModel>,
) -> Result<Vec<appointment::Model>> {
    let mut models = Vec::new();
    let mut txn = db.begin().await?;

    for appointment in appointments {
        let app = appointment.clone().insert(&txn).await?;
        models.push(app);
    }

    txn.commit().await?;
    Ok(models)
}

async fn update_semester_import_status(db: &DatabaseConnection, semester_id: &str) -> Result<()> {
    let mut semester = semester::Entity::find_by_id(Uuid::parse_str(semester_id).unwrap())
        .one(db)
        .await?
        .ok_or("Semester not found")?
        .into_active_model();

    semester.imported_appointments = Set(true);
    semester.update(db).await?;
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
