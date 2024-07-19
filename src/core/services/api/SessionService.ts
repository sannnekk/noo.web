import type { Context } from '@/core/context/Context'
import { ApiService, type ApiResponse } from '@/core/services/ApiService'
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
  public async getSessions(): Promise<ApiResponse<Session[]>> {
    return await this.httpGet(this._route)
  }

  /**
   * Delete session
   */
  public async deleteSession(id: Session['id']): Promise<void> {
    await this.httpDelete(`${this._route}/${id}`)
  }
}
