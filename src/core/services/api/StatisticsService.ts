import type { Context } from '@/core/context/Context'
import type { Statistics } from '@/core/data/Statistics'
import type { Work } from '@/core/data/entities/Work'
import {
  ApiService,
  type ApiResponse,
  type ServiceOptions
} from '@/core/services/ApiService'

/**
 * Statistics service
 */
export class StatisticsService extends ApiService {
  private _route = '/statistics' as const

  /**
   * constructor
   */
  public constructor(context: Context) {
    super(context)
  }

  /**
   * Get statistics
   */
  public async getStatistics(
    username: string,
    to: Date,
    from: Date,
    type?: Work['type'],
    options: ServiceOptions = {}
  ): Promise<ApiResponse<Statistics | null>> {
    return this.httpPost<Statistics>(
      `${this._route}/${username}`,
      {
        to,
        from,
        type
      },
      undefined,
      options
    )
  }
}
