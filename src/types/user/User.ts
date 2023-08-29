export interface User {
  id: string
  role: 'admin' | 'teacher' | 'mentor' | 'student'
  name: string
  email: string
  telegramId?: string
  password?: string
  theme: 'light' | 'dark'
  createdAt: Date
  updatedAt: Date
}
