use std::path::PathBuf;
use tokio::fs;
use tracing::info;

pub async fn get_config_file_path() -> Option<PathBuf> {
    let config_dir: Option<PathBuf> = dirs::config_dir();
    if let Some(dir) = config_dir {
        let app_config_dir = dir.join("Brainwave");
        fs::create_dir_all(&app_config_dir)
            .await
            .expect("failed to create config directory");
        return Some(app_config_dir);
    }
    None
}

pub async fn database_path() -> Option<String> {
    let app_path = get_config_file_path()
        .await
        .expect("Failed to get config path");
    let db_file_path = app_path.join("data.db");
    info!("creating database in: {}", db_file_path.display());
    if std::fs::metadata(&db_file_path).is_err() {
        fs::File::create(&db_file_path)
            .await
            .expect("failed to create db file");
    }
    Some(db_file_path.to_str()?.to_string())
}
