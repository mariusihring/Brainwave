//! `SeaORM` Entity, @generated by sea-orm-codegen 1.1.0

use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, async_graphql :: SimpleObject)]
#[sea_orm(table_name = "module")]
#[graphql(name = "Module")]
#[graphql(complex)]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Uuid,
    pub name: String,
    pub et_cs: i32,
    #[sea_orm(column_type = "Float", nullable)]
    pub grade: Option<f32>,
    pub start_semester: Uuid,
    pub end_semester: Option<Uuid>,
    pub user_id: Uuid,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::course::Entity")]
    Course,
    #[sea_orm(
        belongs_to = "super::semester::Entity",
        from = "Column::EndSemester",
        to = "super::semester::Column::Id",
        on_update = "NoAction",
        on_delete = "NoAction"
    )]
    Semester2,
    #[sea_orm(
        belongs_to = "super::semester::Entity",
        from = "Column::StartSemester",
        to = "super::semester::Column::Id",
        on_update = "NoAction",
        on_delete = "NoAction"
    )]
    Semester1,
    #[sea_orm(
        belongs_to = "super::user::Entity",
        from = "Column::UserId",
        to = "super::user::Column::Id",
        on_update = "NoAction",
        on_delete = "NoAction"
    )]
    User,
}

impl Related<super::course::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Course.def()
    }
}

impl Related<super::user::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::User.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
