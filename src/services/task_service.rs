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

    /// 返回任务列表，可按完成状态筛选。
    pub fn list_tasks(&self, completed: Option<bool>) -> Vec<Task> {
        self.tasks
            .iter()
            .filter(|t| completed.map_or(true, |c| t.completed == c))
            .cloned()
            .collect()
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

    /// 更新任务完成状态。
    pub fn update_task(&mut self, id: u64, completed: bool) -> Result<Task, AppError> {
        let task = self
            .tasks
            .iter_mut()
            .find(|t| t.id == id)
            .ok_or_else(|| AppError::not_found(format!("任务 {id} 不存在")))?;

        task.completed = completed;
        Ok(task.clone())
    }

    /// 删除任务。
    pub fn delete_task(&mut self, id: u64) -> Result<(), AppError> {
        let pos = self
            .tasks
            .iter()
            .position(|t| t.id == id)
            .ok_or_else(|| AppError::not_found(format!("任务 {id} 不存在")))?;

        self.tasks.remove(pos);
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_store() -> TaskStore {
        let mut store = TaskStore::new();
        store.create_task("任务 A".to_string()).unwrap();
        store.create_task("任务 B".to_string()).unwrap();
        store
    }

    #[test]
    fn list_all_tasks() {
        let store = make_store();
        assert_eq!(store.list_tasks(None).len(), 2);
    }

    #[test]
    fn list_filtered_incomplete() {
        let mut store = make_store();
        store.update_task(1, true).unwrap();
        let incomplete = store.list_tasks(Some(false));
        assert_eq!(incomplete.len(), 1);
        assert_eq!(incomplete[0].id, 2);
    }

    #[test]
    fn create_task_empty_title_fails() {
        let mut store = TaskStore::new();
        assert!(store.create_task("  ".to_string()).is_err());
    }

    #[test]
    fn update_task_completed() {
        let mut store = make_store();
        let task = store.update_task(1, true).unwrap();
        assert!(task.completed);
    }

    #[test]
    fn update_nonexistent_task_fails() {
        let mut store = TaskStore::new();
        assert!(store.update_task(99, true).is_err());
    }

    #[test]
    fn delete_task() {
        let mut store = make_store();
        store.delete_task(1).unwrap();
        assert_eq!(store.list_tasks(None).len(), 1);
    }

    #[test]
    fn delete_nonexistent_task_fails() {
        let mut store = TaskStore::new();
        assert!(store.delete_task(99).is_err());
    }
}
