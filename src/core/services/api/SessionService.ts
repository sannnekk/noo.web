import type { Context } from '@/core/context/Context'
import {
  ApiService,
  type ApiResponse,
  type ServiceOptions
} from '@/core/services/ApiService'
import type { Session } from '@/core/data/entities/Session'

/**
 * Session service
 */
export class SessionService extends ApiService {
  private _route = '/session' as const

  /**
   * constructor
   */
  public constructor(context: Context) {
    super(context)
  }

  /**
   * Get sessions
   */
  public async getSessions(
    options: ServiceOptions = {}
  ): Promise<ApiResponse<Session[]>> {
    return await this.httpGet(this._route, undefined, undefined, options)
  }

  /**
   * Delete session
   */
  public async deleteSession(
    id: Session['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpDelete(`${this._route}/${id}`, undefined, options)
  }

  /**
   * Delete current session
   */
  public async deleteCurrentSession(
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpDelete(`${this._route}`, undefined, options)
  }
}
