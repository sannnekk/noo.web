import type { Context } from '@/core/context/Context'
import { ApiService, type ApiResponse } from '@/core/services/ApiService'
import type { User } from '@/core/data/entities/User'

type LoginPayload = {
  usernameOrEmail: string
  password: string
}

type RegisterPayload = {
  username: string
  password: string
  email: string
  name: string
}

type LoginResponse = {
  token: string
  user: User
}

/**
 * Auth service
 */
export class AuthService extends ApiService {
  private _route = '/user' as const

  /**
   * constructor
   */
  public constructor(context: Context) {
    super(context)
  }

  /**
   * Login
   */
  public async login({ usernameOrEmail, password }: LoginPayload) {
    const response = await this.httpPost<LoginResponse>(
      `${this._route}/login`,
      {
        usernameOrEmail,
        password
      }
    )

    if (response.data && 'token' in response.data) {
      this._context.User = response.data.user
      this._context.ApiToken = response.data.token

      this._context.Events.emit('global:login')
    }

    return response
  }

  /**
   * Logout
   */
  public async logout() {
    this._context.clear()
    this._context.Events.emit('global:logout')
  }

  /**
   * Register
   */
  public async register(payload: RegisterPayload) {
    this.httpPost(`${this._route}/register`, payload)
  }

  /**
   * Forgot password
   */
  public async forgotPassword(email: string) {
    this.httpPost(`${this._route}/forgot-password`, { email })
  }
}
