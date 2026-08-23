use r2d2::Pool;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::params;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::sync::Arc;

pub type DbPool = Pool<SqliteConnectionManager>;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct QROptions {
    pub errorCorrectionLevel: String,
    pub darkColor: String,
    pub lightColor: String,
    pub margin: u32,
    pub dotStyle: String,
    pub cornersStyle: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct QREntry {
    pub id: String,
    pub url: String,
    pub label: Option<String>,
    pub createdAt: i64,
    pub pinned: bool,
    pub options: QROptions,
}

pub fn init_db(db_path: PathBuf) -> Arc<DbPool> {
    let manager = SqliteConnectionManager::file(db_path);
    let pool = Pool::new(manager).expect("Failed to create SQLite connection pool");

    let conn = pool.get().expect("Failed to get DB connection");
    conn.execute(
        "CREATE TABLE IF NOT EXISTS entries (
            id TEXT PRIMARY KEY,
            url TEXT NOT NULL,
            label TEXT,
            created_at INTEGER NOT NULL,
            pinned BOOLEAN NOT NULL DEFAULT 0,
            options TEXT NOT NULL
        )",
        [],
    )
    .expect("Failed to create entries table");

    Arc::new(pool)
}

pub fn get_entries(pool: &DbPool) -> Result<Vec<QREntry>, String> {
    let conn = pool.get().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, url, label, created_at, pinned, options FROM entries ORDER BY created_at DESC")
        .map_err(|e| e.to_string())?;

    let entries_iter = stmt
        .query_map([], |row| {
            let options_str: String = row.get(5)?;
            let options: QROptions = serde_json::from_str(&options_str).unwrap_or_else(|_| QROptions {
                errorCorrectionLevel: "M".to_string(),
                darkColor: "#1c1917".to_string(),
                lightColor: "#fafaf9".to_string(),
                margin: 4,
                dotStyle: "rounded".to_string(),
                cornersStyle: "extra-rounded".to_string(),
            });

            Ok(QREntry {
                id: row.get(0)?,
                url: row.get(1)?,
                label: row.get(2)?,
                createdAt: row.get(3)?,
                pinned: row.get::<_, i32>(4)? != 0, // SQLite boolean as integer
                options,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut entries = Vec::new();
    for entry in entries_iter {
        entries.push(entry.map_err(|e| e.to_string())?);
    }

    Ok(entries)
}

pub fn add_entry(pool: &DbPool, entry: QREntry) -> Result<(), String> {
    let conn = pool.get().map_err(|e| e.to_string())?;
    let options_str = serde_json::to_string(&entry.options).map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO entries (id, url, label, created_at, pinned, options) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![
            entry.id,
            entry.url,
            entry.label,
            entry.createdAt,
            if entry.pinned { 1 } else { 0 },
            options_str
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn delete_entry(pool: &DbPool, id: &str) -> Result<(), String> {
    let conn = pool.get().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM entries WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

pub fn toggle_pin(pool: &DbPool, id: &str, pinned: bool) -> Result<(), String> {
    let conn = pool.get().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE entries SET pinned = ?1 WHERE id = ?2",
        params![if pinned { 1 } else { 0 }, id],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

pub fn clear_all(pool: &DbPool) -> Result<(), String> {
    let conn = pool.get().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM entries", [])
        .map_err(|e| e.to_string())?;
    Ok(())
}
