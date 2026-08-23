use crate::db::{self, DbPool, QREntry};
use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::{delete, get, put},
    Json, Router,
};
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};

pub async fn start_server(pool: Arc<DbPool>, port: u16) {
    // Basic CORS to allow mobile app to access the API
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/api/entries", get(get_entries).post(add_entry).delete(clear_all))
        .route("/api/entries/:id", delete(delete_entry))
        .route("/api/entries/:id/pin", put(toggle_pin))
        .layer(cors)
        .with_state(pool);

    let addr = format!("0.0.0.0:{}", port);
    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect("Failed to bind Axum server");

    println!("Mobile Sync API listening on {}", addr);
    axum::serve(listener, app).await.expect("Axum server failed");
}

async fn get_entries(State(pool): State<Arc<DbPool>>) -> Result<Json<Vec<QREntry>>, StatusCode> {
    match db::get_entries(&pool) {
        Ok(entries) => Ok(Json(entries)),
        Err(e) => {
            eprintln!("Error getting entries: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn add_entry(
    State(pool): State<Arc<DbPool>>,
    Json(entry): Json<QREntry>,
) -> Result<StatusCode, StatusCode> {
    match db::add_entry(&pool, entry) {
        Ok(_) => Ok(StatusCode::CREATED),
        Err(e) => {
            eprintln!("Error adding entry: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn delete_entry(
    State(pool): State<Arc<DbPool>>,
    Path(id): Path<String>,
) -> Result<StatusCode, StatusCode> {
    match db::delete_entry(&pool, &id) {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(e) => {
            eprintln!("Error deleting entry: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

#[derive(serde::Deserialize)]
struct PinRequest {
    pinned: bool,
}

async fn toggle_pin(
    State(pool): State<Arc<DbPool>>,
    Path(id): Path<String>,
    Json(req): Json<PinRequest>,
) -> Result<StatusCode, StatusCode> {
    match db::toggle_pin(&pool, &id, req.pinned) {
        Ok(_) => Ok(StatusCode::OK),
        Err(e) => {
            eprintln!("Error toggling pin: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn clear_all(State(pool): State<Arc<DbPool>>) -> Result<StatusCode, StatusCode> {
    match db::clear_all(&pool) {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(e) => {
            eprintln!("Error clearing all entries: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
