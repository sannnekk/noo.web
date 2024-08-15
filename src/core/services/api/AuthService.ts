import type { Context } from '@/core/context/Context'
import { ApiService, type ServiceOptions } from '@/core/services/ApiService'
import type { User } from '@/core/data/entities/User'
import { SessionService } from './SessionService'

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
  private _route = '/auth' as const

  private readonly sessionService: SessionService

  /**
   * constructor
   */
  public constructor(context: Context) {
    super(context)

    this.sessionService = new SessionService(context)
  }

  /**
   * Login
   */
  public async login(
    { usernameOrEmail, password }: LoginPayload,
    options: ServiceOptions = {}
  ) {
    const response = await this.httpPost<LoginResponse>(
      `${this._route}/login`,
      {
        usernameOrEmail,
        password
      },
      undefined,
      options
    )

    if (
      response &&
      'data' in response &&
      response.data &&
      'token' in response.data
    ) {
      this._context.User = response.data.user
      this._context.ApiToken = response.data.token

      this._context.Events.emit('global:login', this._context)
    }

    return response
  }

  public async retryLogin(
    { usernameOrEmail, password }: LoginPayload,
    options: ServiceOptions = {}
  ): Promise<boolean> {
    const response = await this.httpPost<LoginResponse>(
      `${this._route}/login`,
      {
        usernameOrEmail,
        password
      },
      undefined,
      options
    )

    if (
      response &&
      'data' in response &&
      response.data &&
      'token' in response.data
    ) {
      this._context.User = response.data.user
      this._context.ApiToken = response.data.token

      return true
    }

    return false
  }

  /**
   * Logout
   */
  public async logout() {
    try {
      await this.sessionService.deleteCurrentSession({ showLoader: true })
    } catch (error) {
      console.error('Error deleting session', error)
    }

    this._context.clear()
    this._context.Events.emit('global:logout', this._context)
  }

  /**
   * Register
   */
  public async register(
    payload: RegisterPayload,
    options: ServiceOptions = {}
  ) {
    await this.httpPost(`${this._route}/register`, payload, undefined, options)
  }

  /**
   * check username availability
   */
  public async checkUsername(
    username: string,
    options: ServiceOptions = {}
  ): Promise<boolean> {
    const response = await this.httpGet<{ exists: boolean }>(
      `${this._route}/check-username/${username}`,
      undefined,
      undefined,
      options
    )

    return response!.data!.exists
  }

  /**
   * Verify
   */
  public async verify(
    username: string,
    token: string,
    options: ServiceOptions = {}
  ) {
    await this.httpPatch(
      `${this._route}/verify`,
      {
        username,
        token
      },
      undefined,
      options
    )
  }

  /**
   * Change email
   */
  public async verifyEmailChange(
    username: string,
    token: string,
    options: ServiceOptions = {}
  ) {
    await this.httpPatch(
      `${this._route}/verify-email-change`,
      {
        username,
        token
      },
      undefined,
      options
    )
  }

  /**
   * Resend verification email
   */
  public async resendVerification(email: string, options: ServiceOptions = {}) {
    await this.httpPost(
      `${this._route}/resend-verification`,
      { email },
      undefined,
      options
    )
  }

  /**
   * Forgot password
   */
  public async forgotPassword(email: string, options: ServiceOptions = {}) {
    await this.httpPost(
      `${this._route}/forgot-password`,
      { email },
      undefined,
      options
    )
  }
}
