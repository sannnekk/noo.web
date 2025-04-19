export type UserRole = 'admin' | 'teacher' | 'assistant' | 'mentor' | 'student'

export interface UserInfo {
  id: string
  name: string
  username: string
  email: string
  role: UserRole
}
