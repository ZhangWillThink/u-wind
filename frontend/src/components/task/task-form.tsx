import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Field, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const titleSchema = z.string().min(1, '任务标题不能为空').max(100, '标题最长 100 个字符')

interface TaskFormProps {
  onSubmit: (title: string) => Promise<void>
  submitting: boolean
}

export function TaskForm({ onSubmit, submitting }: TaskFormProps) {
  const form = useForm({
    defaultValues: { title: '' },
    onSubmit: async ({ value }) => {
      await onSubmit(value.title.trim())
      form.reset()
    },
  })

  return (
    <form
      className="flex items-start gap-2"
      onSubmit={e => {
        e.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.Field
        name="title"
        validators={{
          onBlur: ({ value }) => {
            const result = titleSchema.safeParse(value.trim())
            if (!result.success) return result.error.issues[0]?.message
          },
          onSubmit: ({ value }) => {
            const result = titleSchema.safeParse(value.trim())
            if (!result.success) return result.error.issues[0]?.message
          },
        }}
      >
        {field => (
          <Field className="flex-1">
            <Input
              value={field.state.value}
              onChange={e => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="输入任务标题"
              disabled={submitting}
              aria-invalid={field.state.meta.errors.length > 0 ? true : undefined}
            />
            <FieldError errors={field.state.meta.errors.map(e => ({ message: String(e) }))} />
          </Field>
        )}
      </form.Field>
      <Button type="submit" disabled={submitting}>
        {submitting ? '创建中...' : '创建任务'}
      </Button>
    </form>
  )
}
