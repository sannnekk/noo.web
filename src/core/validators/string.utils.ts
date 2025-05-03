import { ZodSchema, z } from 'zod'

export type ValidationError = {
  kind: 'warning' | 'error'
  message: string
}

function isValidUsername(value: string): true | ValidationError[] {
  const usernameSchema = z
    .string()
    .min(3, { message: 'Никнейм не может быть короче 3 символов' })
    .max(20, { message: 'Никнейм не может быть длиннее 20 символов' })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: 'Никнейм может содержать только буквы, цифры и символы _ и -'
    })

  return parse(usernameSchema, value)
}

function isValidEmail(value: string): true | ValidationError[] {
  const emailSchema = z
    .string()
    .email({ message: 'Некорректный адрес электронной почты' })

  return parse(emailSchema, value)
}

function isValidPassword(value: string): true | ValidationError[] {
  const passwordSchema = z
    .string()
    .min(8, { message: 'Пароль должен содержать не менее 8 символов' })
    .max(100, { message: 'Пароль не может быть длиннее 100 символов' })
    .regex(/[a-z]/, {
      message: 'Пароль должен содержать хотя бы одну строчную букву'
    })
    .regex(/[A-Z]/, {
      message: 'Пароль должен содержать хотя бы одну заглавную букву'
    })
    .regex(/[0-9]/, { message: 'Пароль должен содержать хотя бы одну цифру' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Пароль должен содержать хотя бы один специальный символ'
    })

  return parse(passwordSchema, value)
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

export { isValidUsername, isValidEmail, isValidPassword }
