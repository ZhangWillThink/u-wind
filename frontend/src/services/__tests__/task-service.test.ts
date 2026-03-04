import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
} from '@/services/task-service'

const mockTask = { id: 1, title: '测试任务', completed: false }

function mockFetch(body: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    headers: { get: () => 'application/json' },
    json: () => Promise.resolve(body),
  })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('fetchTasks', () => {
  it('获取全部任务列表', async () => {
    global.fetch = mockFetch([mockTask])
    const tasks = await fetchTasks()
    expect(fetch).toHaveBeenCalledWith('/api/tasks')
    expect(tasks).toEqual([mockTask])
  })

  it('按完成状态筛选', async () => {
    global.fetch = mockFetch([])
    await fetchTasks(true)
    expect(fetch).toHaveBeenCalledWith('/api/tasks?completed=true')
  })

  it('请求失败时抛出错误', async () => {
    global.fetch = mockFetch({ message: '服务器错误' }, false, 500)
    await expect(fetchTasks()).rejects.toThrow('服务器错误')
  })
})

describe('createTask', () => {
  it('POST 请求创建任务并返回', async () => {
    global.fetch = mockFetch(mockTask)
    const task = await createTask('测试任务')
    expect(fetch).toHaveBeenCalledWith('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '测试任务' }),
    })
    expect(task).toEqual(mockTask)
  })
})

describe('updateTask', () => {
  it('PATCH 请求更新任务完成状态', async () => {
    const updated = { ...mockTask, completed: true }
    global.fetch = mockFetch(updated)
    const task = await updateTask(1, true)
    expect(fetch).toHaveBeenCalledWith('/api/tasks/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    })
    expect(task.completed).toBe(true)
  })
})

describe('deleteTask', () => {
  it('DELETE 请求删除任务', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true })
    await deleteTask(1)
    expect(fetch).toHaveBeenCalledWith('/api/tasks/1', { method: 'DELETE' })
  })

  it('请求失败时抛出错误', async () => {
    global.fetch = mockFetch({ message: '任务不存在' }, false, 404)
    await expect(deleteTask(99)).rejects.toThrow('任务不存在')
  })
})
