export type UserRole = 'admin' | 'teacher' | 'assistant' | 'mentor' | 'student'

export interface UserInfo {
  id: string
  name: string
  username: string
  role: UserRole
}

export interface LoginPayload {
  usernameOrEmail: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: UserInfo
}

export interface RegisterPayload {
  name: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface ResetPasswordPayload {
  token: string
  newPassword: string
}
