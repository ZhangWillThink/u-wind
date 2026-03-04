import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useTasks } from '@/hooks/use-tasks'
import * as taskService from '@/services/task-service'

const taskA = { id: 1, title: '任务 A', completed: false }
const taskB = { id: 2, title: '任务 B', completed: false }

beforeEach(() => {
  vi.spyOn(taskService, 'fetchTasks').mockResolvedValue([taskA, taskB])
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useTasks - 列表加载', () => {
  it('初始化后加载任务列表', async () => {
    const { result } = renderHook(() => useTasks())

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.tasks).toEqual([taskA, taskB])
    expect(result.current.errorMessage).toBeNull()
  })

  it('加载失败时显示错误信息', async () => {
    vi.spyOn(taskService, 'fetchTasks').mockRejectedValue(new Error('网络错误'))

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.errorMessage).toBe('网络错误')
    expect(result.current.tasks).toEqual([])
  })
})

describe('useTasks - 创建任务', () => {
  it('创建成功后追加到列表末尾', async () => {
    const newTask = { id: 3, title: '新任务', completed: false }
    vi.spyOn(taskService, 'createTask').mockResolvedValue(newTask)

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.handleCreate('新任务')
    })

    expect(result.current.tasks).toHaveLength(3)
    expect(result.current.tasks[2]).toEqual(newTask)
  })

  it('创建失败时显示错误信息', async () => {
    vi.spyOn(taskService, 'createTask').mockRejectedValue(new Error('标题不能为空'))

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.handleCreate('')
    })

    expect(result.current.errorMessage).toBe('标题不能为空')
  })
})

describe('useTasks - 错误重试', () => {
  it('调用 retry 后重新加载列表', async () => {
    const fetchSpy = vi.spyOn(taskService, 'fetchTasks')

    const { result } = renderHook(() => useTasks())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.retry()
    })

    await waitFor(() => expect(result.current.loading).toBe(false))

    // 初始加载 + retry = 2 次调用
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })
})
