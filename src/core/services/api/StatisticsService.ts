import type { Context } from '@/core/context/Context'
import type { Work } from '@/core/data/entities/Work'
import { ApiService } from '@/core/services/ApiService'

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

  public async getStatistics(
    username: string,
    to: Date,
    from: Date,
    type?: Work['type']
  ) {
    return this.httpPost(`${this._route}/${username}`, {
      to,
      from,
      type
    })
  }
}
