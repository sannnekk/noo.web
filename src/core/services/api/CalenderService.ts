import type { Context } from '@/core/context/Context'
import { ApiService, type ApiResponse } from '@/core/services/ApiService'

/**
 * Calender service
 */
export class CalenderService extends ApiService {
  private _route = '/calender' as const

  /**
   * constructor
   */
  public constructor(context: Context) {
    super(context)
  }
}
