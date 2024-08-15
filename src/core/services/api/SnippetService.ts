import type { Snippet } from '@/core/data/entities/Snippet'
import {
  ApiService,
  type ApiResponse,
  type ServiceOptions
} from '../ApiService'

export class SnippetService extends ApiService {
  private _route = '/snippet' as const

  /**
   * get snippets
   *
   */
  public async getSnippets(
    options: ServiceOptions = {}
  ): Promise<ApiResponse<Snippet[]>> {
    return this.httpGet<Snippet[]>(this._route, undefined, undefined, options)
  }

  /**
   * create subject
   */
  public async createSnippet(
    data: Omit<Snippet, 'id'>,
    options: ServiceOptions = {}
  ): Promise<void> {
    return this.httpPost<void>(this._route, data, undefined, options)
  }

  /**
   * update subject
   */
  public async updateSnippet(
    id: Snippet['id'],
    data: Snippet,
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
  public async deleteSnippet(
    id: Snippet['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpDelete(`${this._route}/${id}`, undefined, options)
  }
}
