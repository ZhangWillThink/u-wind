use std::sync::{Arc, RwLock};

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
    task_store: Arc<RwLock<TaskStore>>,
}

/// 列表筛选查询参数。
#[derive(Debug, Deserialize)]
struct ListTasksQuery {
    completed: Option<bool>,
}

/// 构建后端路由。
pub fn router() -> Router {
    let state = AppState {
        task_store: Arc::new(RwLock::new(TaskStore::new())),
    };

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
    let store = state
        .task_store
        .read()
        .map_err(|_| AppError::internal("读取任务存储失败"))?;

    Ok(Json(store.list_tasks(query.completed)))
}

async fn create_task_handler(
    State(state): State<AppState>,
    Json(payload): Json<CreateTaskRequest>,
) -> Result<Json<Task>, AppError> {
    let mut store = state
        .task_store
        .write()
        .map_err(|_| AppError::internal("写入任务存储失败"))?;
    let task = store.create_task(payload.title)?;

    Ok(Json(task))
}

async fn update_task_handler(
    State(state): State<AppState>,
    Path(id): Path<u64>,
    Json(payload): Json<UpdateTaskRequest>,
) -> Result<Json<Task>, AppError> {
    let mut store = state
        .task_store
        .write()
        .map_err(|_| AppError::internal("写入任务存储失败"))?;
    let task = store.update_task(id, payload.completed)?;

    Ok(Json(task))
}

async fn delete_task_handler(
    State(state): State<AppState>,
    Path(id): Path<u64>,
) -> Result<StatusCode, AppError> {
    let mut store = state
        .task_store
        .write()
        .map_err(|_| AppError::internal("写入任务存储失败"))?;
    store.delete_task(id)?;

    Ok(StatusCode::NO_CONTENT)
}
