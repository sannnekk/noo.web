import type { Pagination } from './../../data/Pagination'
import type { Context } from '@/core/context/Context'
import type { CalenderEvent } from '@/core/data/entities/CalenderEvent'
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

  /**
   * Get events
   */
  public async getEvents(
    pagination?: Pagination
  ): Promise<ApiResponse<CalenderEvent[]>> {
    return this.httpGet(this._route, pagination)
  }

  /**
   * Create event
   */
  public async createEvent(event: CalenderEvent): Promise<void> {
    this.httpPost(this._route, event)
  }

  /**
   * Update event
   */
  public async updateEvent(
    id: CalenderEvent['id'],
    event: CalenderEvent
  ): Promise<void> {
    this.httpPatch(`${this._route}/${id}`, event)
  }

  /**
   * Delete event
   */
  public async deleteEvent(id: CalenderEvent['id']): Promise<void> {
    this.httpDelete(`${this._route}/${id}`)
  }
}
