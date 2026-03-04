use axum::{routing::get, Json, Router};

use crate::{models::health::HealthStatus, services::health_service::build_health_status};

/// 构建后端路由。
pub fn router() -> Router {
    Router::new().route("/api/health", get(health_handler))
}

async fn health_handler() -> Json<HealthStatus> {
    Json(build_health_status())
}
