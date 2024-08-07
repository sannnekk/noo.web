import type { Pagination } from './../../data/Pagination'
import type { Context } from '@/core/context/Context'
import type { CalenderEvent } from '@/core/data/entities/CalenderEvent'
import {
  ApiService,
  type ApiResponse,
  type ServiceOptions
} from '@/core/services/ApiService'

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
    pagination?: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<CalenderEvent[]>> {
    return await this.httpGet(this._route, pagination, undefined, options)
  }

  /**
   * Create event
   */
  public async createEvent(
    event: CalenderEvent,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<CalenderEvent | null>> {
    return await this.httpPost(this._route, event, undefined, options)
  }

  /**
   * Update event
   */
  public async updateEvent(
    id: CalenderEvent['id'],
    event: CalenderEvent,
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpPatch(`${this._route}/${id}`, event, undefined, options)
  }

  /**
   * Delete event
   */
  public async deleteEvent(
    id: CalenderEvent['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpDelete(`${this._route}/${id}`, undefined, options)
  }
}
