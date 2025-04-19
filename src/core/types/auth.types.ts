export interface LoginPayload {
  usernameOrEmail: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: {
    id: string
    name: string
    username: string
    email: string
    role: string
  }
}

export interface RegisterPayload {
  name: string
  username: string
  email: string
  password: string
  confirmPassword: string
}
