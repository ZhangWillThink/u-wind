export interface Task {
  id: number
  title: string
  completed: boolean
}

interface ErrorResponse {
  message?: string
}

const TASK_API_PATH = '/api/tasks'

async function readErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    const body = (await response.json()) as ErrorResponse
    if (body.message && body.message.trim().length > 0) {
      return body.message
    }
  }

  return `请求失败（${response.status}）`
}

export async function fetchTasks(completed?: boolean): Promise<Task[]> {
  const url =
    completed === undefined
      ? TASK_API_PATH
      : `${TASK_API_PATH}?completed=${completed}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }

  return (await response.json()) as Task[]
}

export async function createTask(title: string): Promise<Task> {
  const response = await fetch(TASK_API_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }

  return (await response.json()) as Task
}

export async function updateTask(id: number, completed: boolean): Promise<Task> {
  const response = await fetch(`${TASK_API_PATH}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }

  return (await response.json()) as Task
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${TASK_API_PATH}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }
}
