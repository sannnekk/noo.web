import type { Context } from '@/core/context/Context'
import {
  ApiService,
  type ApiResponse,
  type ServiceOptions
} from '@/core/services/ApiService'
import type { Pagination } from '@/core/data/Pagination'
import type { GoogleSheetsBinding } from '@/core/data/entities/GoogleSheetsBinding'

/**
 * Google binding service
 */
export class GoogleSheetsBindingService extends ApiService {
  private _route = '/google-docs/binding' as const

  /**
   * constructor
   */
  public constructor(context: Context) {
    super(context)
  }

  /**
   * Get bindings
   */
  public async getBindings(
    pagination?: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<GoogleSheetsBinding[]>> {
    return this.httpGet(this._route, pagination, undefined, options)
  }

  /**
   * Trigger a binding
   */
  public async trigger(
    id: GoogleSheetsBinding['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    return this.httpPatch<void>(
      `${this._route}/${id}/trigger`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Toggle binding status
   */
  public async switchOnOff(
    id: GoogleSheetsBinding['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    return this.httpPatch<void>(
      `${this._route}/${id}/switch-on-off`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Create binding
   */
  public async createBinding(
    data: GoogleSheetsBinding,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<GoogleSheetsBinding | null>> {
    return await this.httpPost<GoogleSheetsBinding>(
      this._route,
      data,
      undefined,
      options
    )
  }

  /**
   * Delete binding
   */
  public async deleteBinding(
    id: GoogleSheetsBinding['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpDelete(`${this._route}/${id}`, undefined, options)
  }
}
