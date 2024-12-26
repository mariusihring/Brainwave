#[cfg(target_os = "macos")]
use tauri::{TitleBarStyle, WebviewUrl, WebviewWindowBuilder};
#[cfg(target_os = "windows")]
use tauri::{WebviewUrl, WebviewWindowBuilder};
mod window;
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            #[cfg(target_os = "macos")]
            let win_builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
                .hidden_title(true)
                .min_inner_size(1300.0, 1000.0);
            #[cfg(target_os = "windows")]
            let win_builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
                .title("Brainwave")
                .min_inner_size(1100.0, 800.0);

            // set transparent title bar only when building for macOS
            #[cfg(target_os = "macos")]
            let win_builder = win_builder.title_bar_style(TitleBarStyle::Transparent);

            let window = win_builder.build().unwrap();

            // set background color only when building for macOS
            #[cfg(target_os = "macos")]
            {
                use cocoa::appkit::{NSColor, NSWindow};
                use cocoa::base::{id, nil};

                let ns_window = window.ns_window().unwrap() as id;
                unsafe {
                    let red = 250.0 / 255.0;
                    let green = 250.0 / 255.0;
                    let blue = 250.0 / 255.0;
                    let alpha = 1.0;
                    let bg_color =
                        NSColor::colorWithRed_green_blue_alpha_(nil, red, green, blue, alpha);

                    ns_window.setBackgroundColor_(bg_color);
                }
            }

            Ok(())
        })
        .plugin(tauri_plugin_fs::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
