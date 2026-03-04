use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    routing::get,
    Json, Router,
};
use serde::Deserialize;

use crate::{
    models::{
        health::HealthStatus,
        task::{CreateTaskRequest, Task, UpdateTaskRequest},
    },
    services::{health_service::build_health_status, task_service::TaskStore},
    utils::error::AppError,
};

#[derive(Clone)]
struct AppState {
    task_store: TaskStore,
}

/// 列表筛选查询参数。
#[derive(Debug, Deserialize)]
struct ListTasksQuery {
    completed: Option<bool>,
}

/// 构建后端路由。
pub fn router(task_store: TaskStore) -> Router {
    let state = AppState { task_store };

    Router::new()
        .route("/api/health", get(health_handler))
        .route(
            "/api/tasks",
            get(list_tasks_handler).post(create_task_handler),
        )
        .route(
            "/api/tasks/:id",
            axum::routing::patch(update_task_handler).delete(delete_task_handler),
        )
        .with_state(state)
}

async fn health_handler() -> Json<HealthStatus> {
    Json(build_health_status())
}

async fn list_tasks_handler(
    State(state): State<AppState>,
    Query(query): Query<ListTasksQuery>,
) -> Result<Json<Vec<Task>>, AppError> {
    let tasks = state.task_store.list_tasks(query.completed).await?;
    Ok(Json(tasks))
}

async fn create_task_handler(
    State(state): State<AppState>,
    Json(payload): Json<CreateTaskRequest>,
) -> Result<Json<Task>, AppError> {
    let task = state.task_store.create_task(payload.title).await?;
    Ok(Json(task))
}

async fn update_task_handler(
    State(state): State<AppState>,
    Path(id): Path<u64>,
    Json(payload): Json<UpdateTaskRequest>,
) -> Result<Json<Task>, AppError> {
    let task = state.task_store.update_task(id, payload.completed).await?;
    Ok(Json(task))
}

async fn delete_task_handler(
    State(state): State<AppState>,
    Path(id): Path<u64>,
) -> Result<StatusCode, AppError> {
    state.task_store.delete_task(id).await?;
    Ok(StatusCode::NO_CONTENT)
}
