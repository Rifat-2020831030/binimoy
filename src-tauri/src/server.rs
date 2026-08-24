use crate::db::{self, DbPool, QREntry};
use axum::{
    extract::{Path, Request, State},
    http::StatusCode,
    middleware::{self, Next},
    response::Response,
    routing::{delete, get, put},
    Json, Router,
};
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};

#[derive(Clone)]
pub struct AppState {
    pub pool: Arc<DbPool>,
    pub token: Arc<String>,
}

async fn auth_middleware(
    State(state): State<AppState>,
    req: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let auth_header = req.headers().get(axum::http::header::AUTHORIZATION);
    if let Some(auth_value) = auth_header {
        if let Ok(auth_str) = auth_value.to_str() {
            if auth_str == format!("Bearer {}", state.token) {
                return Ok(next.run(req).await);
            }
        }
    }
    Err(StatusCode::UNAUTHORIZED)
}

pub async fn start_server(pool: Arc<DbPool>, port: u16, token: Arc<String>) {
    // Basic CORS to allow mobile app to access the API
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let state = AppState { pool, token };

    let app = Router::new()
        .route("/api/entries", get(get_entries).post(add_entry).delete(clear_all))
        .route("/api/entries/:id", delete(delete_entry))
        .route("/api/entries/:id/pin", put(toggle_pin))
        .route_layer(middleware::from_fn_with_state(state.clone(), auth_middleware))
        .layer(cors)
        .with_state(state);

    let addr = format!("0.0.0.0:{}", port);
    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect("Failed to bind Axum server");

    println!("Mobile Sync API listening on {}", addr);
    axum::serve(listener, app).await.expect("Axum server failed");
}

#[derive(serde::Deserialize)]
struct SearchQuery {
    q: Option<String>,
}

async fn get_entries(
    State(state): State<AppState>,
    axum::extract::Query(query): axum::extract::Query<SearchQuery>,
) -> Result<Json<Vec<QREntry>>, StatusCode> {
    match db::get_entries(&state.pool, query.q) {
        Ok(entries) => Ok(Json(entries)),
        Err(e) => {
            eprintln!("Error getting entries: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn add_entry(
    State(state): State<AppState>,
    Json(entry): Json<QREntry>,
) -> Result<StatusCode, StatusCode> {
    match db::add_entry(&state.pool, entry) {
        Ok(_) => Ok(StatusCode::CREATED),
        Err(e) => {
            eprintln!("Error adding entry: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn delete_entry(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<StatusCode, StatusCode> {
    match db::delete_entry(&state.pool, &id) {
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
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(req): Json<PinRequest>,
) -> Result<StatusCode, StatusCode> {
    match db::toggle_pin(&state.pool, &id, req.pinned) {
        Ok(_) => Ok(StatusCode::OK),
        Err(e) => {
            eprintln!("Error toggling pin: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn clear_all(State(state): State<AppState>) -> Result<StatusCode, StatusCode> {
    match db::clear_all(&state.pool) {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(e) => {
            eprintln!("Error clearing all entries: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
