pub mod db;
pub mod server;

use db::{DbPool, QREntry};
use std::sync::Arc;
use tauri::Manager;
use tauri::State;

#[tauri::command]
fn get_entries(pool: State<'_, Arc<DbPool>>) -> Result<Vec<QREntry>, String> {
    db::get_entries(&pool)
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
            get_network_info
        ])
        .setup(|app| {
            let app_dir = app.path().app_data_dir().unwrap_or_else(|_| std::env::current_dir().unwrap());
            std::fs::create_dir_all(&app_dir).unwrap();
            
            let db_path = app_dir.join("binimoy.db");
            let pool = db::init_db(db_path);
            
            app.manage(pool.clone());
            
            // Spawn Axum server
            tauri::async_runtime::spawn(async move {
                server::start_server(pool, 14201).await;
            });
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
