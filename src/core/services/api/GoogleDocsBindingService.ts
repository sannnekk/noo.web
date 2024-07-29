import type { Context } from '@/core/context/Context'
import {
  ApiService,
  type ApiResponse,
  type ServiceOptions
} from '@/core/services/ApiService'
import type { Pagination } from '@/core/data/Pagination'
import type { GoogleDocsBinding } from '@/core/data/entities/GoogleDocsBinding'

/**
 * Google binding service
 */
export class GoogleDocsBindingService extends ApiService {
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
  ): Promise<ApiResponse<GoogleDocsBinding[]>> {
    return await this.httpGet(this._route, pagination, undefined, options)
  }

  /**
   * Create binding
   */
  public async createBinding(
    data: GoogleDocsBinding,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<GoogleDocsBinding | null>> {
    return await this.httpPost<GoogleDocsBinding>(
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
    id: GoogleDocsBinding['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpDelete(`${this._route}/${id}`, undefined, options)
  }
}
