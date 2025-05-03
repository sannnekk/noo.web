import { describe, expect, it, vi, afterEach } from 'vitest'
import { Api, type ApiResponse } from '../api.utils'
import { AuthService } from './auth.service'
import type {
  LoginPayload,
  ResetPasswordPayload,
  RegisterPayload
} from './auth.types'

// Mock API responses
const mockSuccessResponse: ApiResponse<any> = { data: {} }
const mockErrorResponse: ApiResponse = {
  data: undefined,
  error: {
    id: 'UNKNOWN_ERROR',
    statusCode: 500,
    name: 'Internal Server Error',
    description: 'An unexpected error occurred',
    payload: null
  }
}

describe('AuthService', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should call API with correct parameters', async () => {
      const spy = vi.spyOn(Api, 'post').mockResolvedValue(mockSuccessResponse)
      const payload: LoginPayload = {
        usernameOrEmail: 'test@example.com',
        password: 'password123'
      }

      const result = await AuthService.login(payload)

      expect(spy).toHaveBeenCalledWith('/auth/login', payload)
      expect(result).toEqual(mockSuccessResponse)
    })

    it('should handle API errors', async () => {
      vi.spyOn(Api, 'post').mockResolvedValue(mockErrorResponse)
      const result = await AuthService.login({
        usernameOrEmail: 'test',
        password: 'wrong'
      })

      expect(result.error).toBeDefined()
    })
  })

  describe('forgotPassword', () => {
    it('should send password reset email', async () => {
      const spy = vi.spyOn(Api, 'post').mockResolvedValue(mockSuccessResponse)
      const email = 'user@example.com'

      const result = await AuthService.forgotPassword(email)

      expect(spy).toHaveBeenCalledWith('/auth/forgot-password', { email })
      expect(result).toEqual(mockSuccessResponse)
    })
  })

  describe('resetPassword', () => {
    it('should submit new password', async () => {
      const spy = vi.spyOn(Api, 'post').mockResolvedValue(mockSuccessResponse)
      const payload: ResetPasswordPayload = {
        token: 'reset-token',
        newPassword: 'new-password'
      }

      const result = await AuthService.resetPassword(payload)

      expect(spy).toHaveBeenCalledWith('/auth/reset-password', payload)
      expect(result).toEqual(mockSuccessResponse)
    })
  })

  describe('verifyEmail', () => {
    it('should validate email token', async () => {
      const spy = vi.spyOn(Api, 'post').mockResolvedValue(mockSuccessResponse)
      const token = 'email-verification-token'

      const result = await AuthService.verifyEmail(token)

      expect(spy).toHaveBeenCalledWith('/auth/verify-email', { token })
      expect(result).toEqual(mockSuccessResponse)
    })
  })

  describe('register', () => {
    it('should create new user', async () => {
      const spy = vi.spyOn(Api, 'post').mockResolvedValue(mockSuccessResponse)
      const payload: RegisterPayload = {
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      }

      const result = await AuthService.register(payload)

      expect(spy).toHaveBeenCalledWith('/auth/register', payload)
      expect(result).toEqual(mockSuccessResponse)
    })
  })

  describe('removeCurrentSession', () => {
    it('should delete current session', async () => {
      const spy = vi.spyOn(Api, 'delete').mockResolvedValue(mockSuccessResponse)

      const result = await AuthService.removeCurrentSession()

      expect(spy).toHaveBeenCalledWith('/auth/current-session')
      expect(result).toEqual(mockSuccessResponse)
    })
  })
})
