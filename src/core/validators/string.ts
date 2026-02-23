import { z } from 'zod'

export function validateEmail(email: string): boolean {
  return z.string().email().safeParse(email).success
}

export function validateUsername(username: string): boolean {
  return z
    .string()
    .regex(/^[A-Za-z0-9_-]+$/i)
    .safeParse(username).success
}

export function validateName(name: string): boolean {
  return z.string().safeParse(name).success
}
