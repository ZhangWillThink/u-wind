use serde::{Deserialize, Serialize};

/// 任务实体。
#[derive(Debug, Clone, Serialize)]
pub struct Task {
    pub id: u64,
    pub title: String,
    pub completed: bool,
}

impl Task {
    /// 创建任务实体。
    pub fn new(id: u64, title: String) -> Self {
        Self {
            id,
            title,
            completed: false,
        }
    }
}

/// 创建任务请求体。
#[derive(Debug, Deserialize)]
pub struct CreateTaskRequest {
    pub title: String,
}

/// 更新任务请求体。
#[derive(Debug, Deserialize)]
pub struct UpdateTaskRequest {
    pub completed: bool,
}
