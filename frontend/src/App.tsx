import { useTasks } from '@/hooks/use-tasks'

import { TaskForm } from './components/task/task-form'
import { TaskList } from './components/task/task-list'

function App() {
  const { tasks, loading, errorMessage, submitting, handleCreate, handleToggle, handleDelete, retry } =
    useTasks()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">u-wind Task</h1>
        <p className="text-sm text-muted-foreground">管理你的任务清单</p>
      </header>

      <TaskForm onSubmit={handleCreate} submitting={submitting} />

      {errorMessage ? (
        <div className="flex items-center justify-between rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2">
          <p className="text-sm text-destructive">{errorMessage}</p>
          <button
            onClick={retry}
            className="text-xs text-destructive underline-offset-2 hover:underline"
          >
            重试
          </button>
        </div>
      ) : null}

      <TaskList tasks={tasks} loading={loading} onToggle={handleToggle} onDelete={handleDelete} />
    </main>
  )
}

export default App
