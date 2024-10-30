use sea_orm::entity::prelude::*;
use super::_entities::users::ActiveModel;


impl ActiveModelBehavior for ActiveModel {}


// Input Type for Graphql
