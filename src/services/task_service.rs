use sqlx::{Row, SqlitePool};

use crate::{models::task::Task, utils::error::AppError};

/// 任务存储服务（SQLite 实现）。
#[derive(Clone)]
pub struct TaskStore {
    pool: SqlitePool,
}

impl TaskStore {
    /// 连接数据库并初始化表结构。
    pub async fn new(db_url: &str) -> Result<Self, AppError> {
        use sqlx::sqlite::SqliteConnectOptions;
        use std::str::FromStr;

        let opts = SqliteConnectOptions::from_str(db_url)?.create_if_missing(true);
        let pool = SqlitePool::connect_with(opts).await?;

        sqlx::query(
            "CREATE TABLE IF NOT EXISTS tasks (
                id        INTEGER PRIMARY KEY AUTOINCREMENT,
                title     TEXT    NOT NULL,
                completed BOOLEAN NOT NULL DEFAULT FALSE
            )",
        )
        .execute(&pool)
        .await?;

        Ok(Self { pool })
    }

    /// 返回任务列表，可按完成状态筛选。
    pub async fn list_tasks(&self, completed: Option<bool>) -> Result<Vec<Task>, AppError> {
        let rows = if let Some(c) = completed {
            sqlx::query("SELECT id, title, completed FROM tasks WHERE completed = ? ORDER BY id")
                .bind(c)
                .fetch_all(&self.pool)
                .await?
        } else {
            sqlx::query("SELECT id, title, completed FROM tasks ORDER BY id")
                .fetch_all(&self.pool)
                .await?
        };

        let tasks = rows
            .iter()
            .map(|r| Task {
                id: r.get::<i64, _>("id") as u64,
                title: r.get("title"),
                completed: r.get("completed"),
            })
            .collect();

        Ok(tasks)
    }

    /// 创建一个新任务。
    pub async fn create_task(&self, title: String) -> Result<Task, AppError> {
        let title = title.trim().to_string();
        if title.is_empty() {
            return Err(AppError::validation("任务标题不能为空"));
        }

        let result = sqlx::query("INSERT INTO tasks (title, completed) VALUES (?, FALSE)")
            .bind(&title)
            .execute(&self.pool)
            .await?;

        Ok(Task {
            id: result.last_insert_rowid() as u64,
            title,
            completed: false,
        })
    }

    /// 更新任务完成状态。
    pub async fn update_task(&self, id: u64, completed: bool) -> Result<Task, AppError> {
        let rows_affected = sqlx::query("UPDATE tasks SET completed = ? WHERE id = ?")
            .bind(completed)
            .bind(id as i64)
            .execute(&self.pool)
            .await?
            .rows_affected();

        if rows_affected == 0 {
            return Err(AppError::not_found(format!("任务 {id} 不存在")));
        }

        let row = sqlx::query("SELECT id, title, completed FROM tasks WHERE id = ?")
            .bind(id as i64)
            .fetch_one(&self.pool)
            .await?;

        Ok(Task {
            id: row.get::<i64, _>("id") as u64,
            title: row.get("title"),
            completed: row.get("completed"),
        })
    }

    /// 删除任务。
    pub async fn delete_task(&self, id: u64) -> Result<(), AppError> {
        let rows_affected = sqlx::query("DELETE FROM tasks WHERE id = ?")
            .bind(id as i64)
            .execute(&self.pool)
            .await?
            .rows_affected();

        if rows_affected == 0 {
            return Err(AppError::not_found(format!("任务 {id} 不存在")));
        }

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    async fn make_store() -> TaskStore {
        let store = TaskStore::new("sqlite::memory:").await.unwrap();
        store.create_task("任务 A".to_string()).await.unwrap();
        store.create_task("任务 B".to_string()).await.unwrap();
        store
    }

    #[tokio::test]
    async fn list_all_tasks() {
        let store = make_store().await;
        assert_eq!(store.list_tasks(None).await.unwrap().len(), 2);
    }

    #[tokio::test]
    async fn list_filtered_incomplete() {
        let store = make_store().await;
        store.update_task(1, true).await.unwrap();
        let incomplete = store.list_tasks(Some(false)).await.unwrap();
        assert_eq!(incomplete.len(), 1);
        assert_eq!(incomplete[0].id, 2);
    }

    #[tokio::test]
    async fn create_task_empty_title_fails() {
        let store = TaskStore::new("sqlite::memory:").await.unwrap();
        assert!(store.create_task("  ".to_string()).await.is_err());
    }

    #[tokio::test]
    async fn update_task_completed() {
        let store = make_store().await;
        let task = store.update_task(1, true).await.unwrap();
        assert!(task.completed);
    }

    #[tokio::test]
    async fn update_nonexistent_task_fails() {
        let store = TaskStore::new("sqlite::memory:").await.unwrap();
        assert!(store.update_task(99, true).await.is_err());
    }

    #[tokio::test]
    async fn delete_task() {
        let store = make_store().await;
        store.delete_task(1).await.unwrap();
        assert_eq!(store.list_tasks(None).await.unwrap().len(), 1);
    }

    #[tokio::test]
    async fn delete_nonexistent_task_fails() {
        let store = TaskStore::new("sqlite::memory:").await.unwrap();
        assert!(store.delete_task(99).await.is_err());
    }
}
