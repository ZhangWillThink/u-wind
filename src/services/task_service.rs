use crate::{models::task::Task, utils::error::AppError};

/// 任务存储服务（内存实现）。
#[derive(Debug, Default)]
pub struct TaskStore {
    next_id: u64,
    tasks: Vec<Task>,
}

impl TaskStore {
    /// 创建任务存储实例。
    pub fn new() -> Self {
        Self {
            next_id: 1,
            tasks: Vec::new(),
        }
    }

    /// 返回全部任务。
    pub fn list_tasks(&self) -> Vec<Task> {
        self.tasks.clone()
    }

    /// 创建一个新任务。
    pub fn create_task(&mut self, title: String) -> Result<Task, AppError> {
        let title = title.trim();
        if title.is_empty() {
            return Err(AppError::validation("任务标题不能为空"));
        }

        let task = Task::new(self.next_id, title.to_string());
        self.next_id += 1;
        self.tasks.push(task.clone());

        Ok(task)
    }
}
