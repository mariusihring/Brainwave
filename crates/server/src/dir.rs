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
