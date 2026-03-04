import { useCallback, useEffect, useRef, useState } from 'react'

import {
  createTask,
  deleteTask,
  fetchTasks,
  type Task,
  updateTask,
} from '@/services/task-service'

interface UseTasksResult {
  tasks: Task[]
  loading: boolean
  errorMessage: string | null
  submitting: boolean
  handleCreate: (title: string) => Promise<void>
  handleToggle: (id: number, completed: boolean) => Promise<void>
  handleDelete: (id: number) => Promise<void>
  retry: () => void
}

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const taskList = await fetchTasks()
      setTasks(taskList)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '加载任务失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const handleCreate = useCallback(
    async (title: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)

      await new Promise<void>(resolve => {
        debounceRef.current = setTimeout(resolve, 200)
      })

      setSubmitting(true)
      setErrorMessage(null)
      try {
        const task = await createTask(title)
        setTasks(prev => [...prev, task])
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '创建任务失败')
      } finally {
        setSubmitting(false)
      }
    },
    [],
  )

  const handleToggle = useCallback(async (id: number, completed: boolean) => {
    setErrorMessage(null)
    try {
      const updated = await updateTask(id, completed)
      setTasks(prev => prev.map(t => (t.id === updated.id ? updated : t)))
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '更新任务失败')
    }
  }, [])

  const handleDelete = useCallback(async (id: number) => {
    setErrorMessage(null)
    try {
      await deleteTask(id)
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '删除任务失败')
    }
  }, [])

  return {
    tasks,
    loading,
    errorMessage,
    submitting,
    handleCreate,
    handleToggle,
    handleDelete,
    retry: () => void load(),
  }
}
