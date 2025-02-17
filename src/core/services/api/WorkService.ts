import type { Work } from '@/core/data/entities/Work'
import type { Context } from '@/core/context/Context'
import type { Pagination } from '@/core/data/Pagination'
import {
  ApiService,
  type ApiResponse,
  type ServiceOptions
} from '@/core/services/ApiService'
import type { Material } from '@/core/data/entities/Material'
import type { WorkStatistics } from '@/core/data/entities/WorkStatistics'

/**
 * Work service
 */
export class WorkService extends ApiService {
  private _route = '/work' as const

  /**
   * constructor
   */
  public constructor(context: Context) {
    super(context)
  }

  /**
   * get work by slug
   */
  public async getWork(
    slug: string,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<Work | null>> {
    return await this.httpGet<Work>(
      `${this._route}/${slug}`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * get work statistics by id
   */
  public async getWorkStatistics(
    id: Work['id'],
    options: ServiceOptions = {}
  ): Promise<ApiResponse<WorkStatistics | null>> {
    return await this.httpGet<WorkStatistics>(
      `${this._route}/${id}/statistics`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * get works
   */
  public async getWorks(
    pagination: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<Work[]>> {
    return await this.httpGet<Work[]>(
      this._route,
      pagination,
      undefined,
      options
    )
  }

  /**
   * create work
   */
  public async createWork(
    work: Work,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<Work | null>> {
    return this.httpPost<Work | null>(this._route, work, undefined, options)
  }

  /**
   * copy work
   */
  public async copyWork(
    workSlug: Work['slug'],
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpPost(
      `${this._route}/copy/${workSlug}`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * get related materials
   */
  public async getRelatedMaterials(
    workId: Work['id'],
    pagination: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<Material[]>> {
    return await this.httpGet<Material[]>(
      `${this._route}/${workId}/related-materials`,
      pagination,
      undefined,
      options
    )
  }

  /**
   * update work
   */
  public async updateWork(
    workId: Work['id'],
    work: Work,
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpPatch(`${this._route}/${workId}`, work, undefined, options)
  }

  /**
   * delete work
   */
  public async deleteWork(
    id: string,
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpDelete(`${this._route}/${id}`, undefined, options)
  }
}
