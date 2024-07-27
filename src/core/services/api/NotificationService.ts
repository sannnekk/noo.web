import type { Context } from '@/core/context/Context'
import { ApiService } from '@/core/services/ApiService'

/**
 * Notification service
 */
export class NotificationService extends ApiService {
  private _route = '/notification' as const

  /**
   * constructor
   */
  public constructor(context: Context) {
    super(context)
  }
}
