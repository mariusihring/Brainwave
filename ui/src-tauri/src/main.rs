// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tokio::task;

#[tokio::main]
async fn main() {
    let server_task = task::spawn(async {
        server::run_server().await;
    });
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    let _ = server_task.await;
}
