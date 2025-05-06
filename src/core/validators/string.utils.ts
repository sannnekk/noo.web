import { z } from 'zod'
import { parse, type ValidationError } from './validation-helpers.utils'

function isStringOfLength(
  value: unknown,
  min: number,
  max: number
): true | ValidationError[] {
  const stringSchema = z
    .string()
    .min(min, { message: `Длина должна быть не менее ${min} символов` })
    .max(max, { message: `Длина не может превышать ${max} символов` })

  return parse(stringSchema, value)
}

function isValidUsername(value: unknown): true | ValidationError[] {
  const usernameSchema = z
    .string()
    .min(3, { message: 'Никнейм не может быть короче 3 символов' })
    .max(20, { message: 'Никнейм не может быть длиннее 20 символов' })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message:
        'Никнейм может содержать только латинские буквы, цифры и символы _ и -'
    })

  return parse(usernameSchema, value)
}

function isValidEmail(value: unknown): true | ValidationError[] {
  const emailSchema = z
    .string()
    .email({ message: 'Некорректный адрес электронной почты' })

  return parse(emailSchema, value)
}

function isValidPassword(value: unknown): true | ValidationError[] {
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

export { isStringOfLength, isValidUsername, isValidEmail, isValidPassword }
