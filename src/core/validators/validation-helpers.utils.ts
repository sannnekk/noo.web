import type { ZodSchema } from 'zod'

type ValidationError = {
  kind: 'warning' | 'error'
  message: string
}

function parse(schema: ZodSchema, value: unknown): true | ValidationError[] {
  const result = schema.safeParse(value)

  if (result.success) {
    return true
  } else {
    return result.error.errors.map((error) => ({
      kind: 'error',
      message: error.message
    }))
  }
}

export { parse, type ValidationError }
