import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import type { Task } from '@/services/task-service'

interface TaskItemProps {
  task: Task
  onToggle: (id: number, completed: boolean) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className="flex items-center gap-3 rounded-md border p-3">
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) => void onToggle(task.id, !!checked)}
        aria-label={`标记"${task.title}"为${task.completed ? '未完成' : '已完成'}`}
      />
      <span
        className={`flex-1 text-sm ${task.completed ? 'text-muted-foreground line-through' : ''}`}
      >
        {task.title}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => void onDelete(task.id)}
        aria-label={`删除"${task.title}"`}
      >
        <Trash2 />
      </Button>
    </li>
  )
}
