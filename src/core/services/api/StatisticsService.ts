import type { Context } from '@/core/context/Context'
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
}
