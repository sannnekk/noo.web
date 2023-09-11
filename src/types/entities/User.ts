export interface User {
  id: string
  slug: string
  role: 'admin' | 'teacher' | 'mentor' | 'student'
  name: string
  email: string
  telegramId?: string
  password?: string
  isBlocked: boolean
  forbidden?: number
  createdAt: Date
  updatedAt: Date
}
