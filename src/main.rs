mod api;
mod models;
mod services;
mod utils;

use std::net::SocketAddr;

use utils::error::AppError;

#[tokio::main]
async fn main() -> Result<(), AppError> {
    let app = api::router();
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    let listener = tokio::net::TcpListener::bind(addr).await?;

    println!("后端服务已启动: http://{addr}");
    axum::serve(listener, app).await?;

    Ok(())
}
