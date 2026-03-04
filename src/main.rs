mod api;
mod models;
mod services;
mod utils;

use std::net::SocketAddr;

use services::task_service::TaskStore;
use utils::error::AppError;

#[tokio::main]
async fn main() -> Result<(), AppError> {
    let db_url = std::env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite:tasks.db".to_string());
    let task_store = TaskStore::new(&db_url).await?;

    let app = api::router(task_store);
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    let listener = tokio::net::TcpListener::bind(addr).await?;

    println!("后端服务已启动: http://{addr}");
    axum::serve(listener, app).await?;

    Ok(())
}
