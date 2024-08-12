import type { Subject } from '@/core/data/entities/Subject'
import {
  ApiService,
  type ApiResponse,
  type ServiceOptions
} from '../ApiService'
import type { Pagination } from '@/core/data/Pagination'

export class SubjectService extends ApiService {
  private _route = '/subject' as const

  /**
   * get subjects
   *
   */
  public async getSubjects(
    pagination?: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<Subject[]>> {
    return this.httpGet<Subject[]>(this._route, pagination, undefined, options)
  }

  /**
   * get subject by slug
   */
  public async getSubject(
    id: Subject['id'],
    options: ServiceOptions = {}
  ): Promise<ApiResponse<Subject | null>> {
    return this.httpGet<Subject>(
      `${this._route}/${id}`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * create subject
   */
  public async createSubject(
    data: Subject,
    options: ServiceOptions = {}
  ): Promise<void> {
    return this.httpPost<void>(this._route, data, undefined, options)
  }

  /**
   * update subject
   */
  public async updateSubject(
    id: Subject['id'],
    data: Subject,
    options: ServiceOptions = {}
  ): Promise<void> {
    return this.httpPatch<void>(
      `${this._route}/${id}`,
      data,
      undefined,
      options
    )
  }

  /**
   * delete subject
   */
  public async deleteSubject(
    id: Subject['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpDelete(`${this._route}/${id}`, undefined, options)
  }
}
