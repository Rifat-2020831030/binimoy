pub mod db;
pub mod server;

use db::{DbPool, QREntry};
use std::sync::Arc;
use tauri::Manager;
use tauri::State;
use tauri::menu::{Menu, MenuItem};
use tauri::tray::TrayIconBuilder;
use tauri::Emitter;
use rand::Rng;

#[tauri::command]
fn get_entries(pool: State<'_, Arc<DbPool>>) -> Result<Vec<QREntry>, String> {
    db::get_entries(&pool, None)
}

#[tauri::command]
fn get_pairing_token(token: State<'_, Arc<String>>) -> Result<String, String> {
    Ok(token.to_string())
}

#[tauri::command]
fn add_entry(pool: State<'_, Arc<DbPool>>, entry: QREntry) -> Result<(), String> {
    db::add_entry(&pool, entry)
}

#[tauri::command]
fn delete_entry(pool: State<'_, Arc<DbPool>>, id: String) -> Result<(), String> {
    db::delete_entry(&pool, &id)
}

#[tauri::command]
fn toggle_pin(pool: State<'_, Arc<DbPool>>, id: String, pinned: bool) -> Result<(), String> {
    db::toggle_pin(&pool, &id, pinned)
}

#[tauri::command]
fn clear_all(pool: State<'_, Arc<DbPool>>) -> Result<(), String> {
    db::clear_all(&pool)
}



#[tauri::command]
fn get_network_info() -> Result<String, String> {
    match local_ip_address::local_ip() {
        Ok(ip) => Ok(ip.to_string()),
        Err(e) => Err(e.to_string()),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .invoke_handler(tauri::generate_handler![
            get_entries,
            add_entry,
            delete_entry,
            toggle_pin,
            clear_all,
            get_network_info,
            get_pairing_token
        ])
        .setup(|app| {
            let app_dir = app.path().app_data_dir().unwrap_or_else(|_| std::env::current_dir().unwrap());
            std::fs::create_dir_all(&app_dir).unwrap();
            
            let db_path = app_dir.join("binimoy.db");
            let pool = db::init_db(db_path);
            
            // Load or Generate a persistent 4-digit PIN for pairing from the database
            let token_str = match db::get_setting(&pool, "pairing_pin") {
                Some(pin) => pin,
                None => {
                    let pin_num: u16 = rand::thread_rng().gen_range(1000..=9999);
                    let s = pin_num.to_string();
                    let _ = db::set_setting(&pool, "pairing_pin", &s);
                    s
                }
            };
            
            let token = Arc::new(token_str);
            
            app.manage(pool.clone());
            app.manage(token.clone());
            
            // Spawn Axum server
            tauri::async_runtime::spawn(async move {
                server::start_server(pool, 14201, token).await;
            });

            // Set up System Tray
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let generate_i = MenuItem::with_id(app, "generate", "Generate from Clipboard", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&generate_i, &quit_i])?;

            let tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .show_menu_on_left_click(true)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "quit" => {
                        std::process::exit(0);
                    }
                    "generate" => {
                        let _ = app.emit("quick-generate", ());
                        // Also show the window if it was hidden
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    _ => {}
                })
                .build(app)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
