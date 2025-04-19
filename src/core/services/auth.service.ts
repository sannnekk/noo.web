import type { ApiResponse } from '../api/api-response.data'
import { type Axios } from '../api/axios.service'
import type { EventEmitter } from '../events/event-emitter.service'
import type { LoginEvent } from '../events/types/LoginEvent.type'
import type {
  LoginResponse,
  LoginPayload,
  RegisterPayload
} from '../types/auth.types'

interface IAuthService {
  login: (
    usernameOrEmail: string,
    password: string
  ) => Promise<ApiResponse<LoginResponse>>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  logout: () => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  refreshToken: () => Promise<void>
}

class AuthService implements IAuthService {
  private readonly axios: Axios

  private readonly eventEmitter: EventEmitter

  private readonly path = '/auth' as const

  constructor(axios: Axios, eventEmitter: EventEmitter) {
    this.axios = axios
    this.eventEmitter = eventEmitter
  }

  async login(
    usernameOrEmail: string,
    password: string
  ): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await this.axios.post<LoginPayload, LoginResponse>(
        `${this.path}/login`,
        {
          usernameOrEmail,
          password
        }
      )

      const data = response.getData()!

      this.eventEmitter.emit<LoginEvent>('global:login', {
        username: data?.user.username,
        userId: data?.user.id
      })

      return response
    } catch (error) {
      return error as ApiResponse<LoginResponse>
    }
  }

  async forgotPassword(email: string) {
    throw new Error('Function not implemented.')
  }

  async resetPassword(token: string, password: string) {
    throw new Error('Function not implemented.')
  }

  async verifyEmail(token: string) {
    throw new Error('Function not implemented.')
  }

  async logout() {
    throw new Error('Function not implemented.')
  }

  async register(payload: RegisterPayload) {
    throw new Error('Function not implemented.')
  }

  async refreshToken(): Promise<void> {
    throw new Error('Function not implemented.')
  }
}

function createAuthService(
  axios: Axios,
  eventEmitter: EventEmitter
): IAuthService {
  return new AuthService(axios, eventEmitter)
}

export { createAuthService, type IAuthService }
