import type { Work } from '@/core/data/entities/Work'
import type { Context } from '@/core/context/Context'
import type { Pagination } from '@/core/data/Pagination'
import { ApiService, type ApiResponse } from '@/core/services/ApiService'

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
  public async getWork(slug: string): Promise<ApiResponse<Work | undefined>> {
    return this.httpGet<Work>(`${this._route}/${slug}`) as any
  }

  /**
   * get works
   */
  public async getWorks(pagination: Pagination): Promise<ApiResponse<Work[]>> {
    return this.httpGet<Work[]>(this._route, pagination) as any
  }

  /**
   * create work
   */
  public async createWork(work: Work): Promise<void> {
    this.httpPost(this._route, work)
  }

  /**
   * update work
   */
  public async updateWork(workId: Work['id'], work: Work): Promise<void> {
    this.httpPatch(`${this._route}/${workId}`, work)
  }

  /**
   * delete work
   */
  public async deleteWork(id: string): Promise<void> {
    this.httpDelete(`${this._route}/${id}`)
  }
}
