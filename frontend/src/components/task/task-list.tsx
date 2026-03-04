import type { Task } from '@/services/task-service'

import { TaskItem } from './task-item'

interface TaskListProps {
  tasks: Task[]
  loading: boolean
  onToggle: (id: number, completed: boolean) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function TaskList({ tasks, loading, onToggle, onDelete }: TaskListProps) {
  if (loading) {
    return <p className="text-sm text-muted-foreground">加载中...</p>
  }

  if (tasks.length === 0) {
    return (
      <li className="list-none rounded-md border border-dashed p-4 text-sm text-muted-foreground">
        暂无任务，请先创建一条。
      </li>
    )
  }

  return (
    <ul className="space-y-2">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  )
}
