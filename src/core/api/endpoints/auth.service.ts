import { type ApiResponse, Api } from '../api.utils'
import type {
  LoginResponse,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload
} from './auth.types'

interface AuthService {
  login: (paylod: LoginPayload) => Promise<ApiResponse<LoginResponse>>
  forgotPassword: (email: string) => Promise<ApiResponse>
  resetPassword: (payload: ResetPasswordPayload) => Promise<ApiResponse>
  verifyEmail: (token: string) => Promise<ApiResponse>
  register: (payload: RegisterPayload) => Promise<ApiResponse>
  removeCurrentSession: () => Promise<ApiResponse>
}

async function login(
  payload: LoginPayload
): Promise<ApiResponse<LoginResponse>> {
  return await Api.post<LoginPayload, LoginResponse>('/auth/login', payload)
}

async function forgotPassword(email: string): Promise<ApiResponse> {
  return await Api.post('/auth/forgot-password', { email })
}

async function resetPassword(
  payload: ResetPasswordPayload
): Promise<ApiResponse> {
  return await Api.post('/auth/reset-password', payload)
}

async function verifyEmail(token: string): Promise<ApiResponse> {
  return await Api.post('/auth/verify-email', { token })
}

async function register(payload: RegisterPayload): Promise<ApiResponse> {
  return await Api.post('/auth/register', payload)
}

async function removeCurrentSession(): Promise<ApiResponse> {
  return await Api.delete('/auth/current-session')
}

export const AuthService: AuthService = {
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  register,
  removeCurrentSession
}
