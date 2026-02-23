import type { FAQArticle } from '@/core/data/entities/FAQArticle'
import {
  ApiService,
  type ApiResponse,
  type ServiceOptions
} from '../ApiService'
import type { Pagination } from '@/core/data/Pagination'
import type { FAQCategory } from '@/core/data/entities/FAQCategory'

export class FAQService extends ApiService {
  private _route = '/faq' as const

  /**
   * get faq articles
   *
   */
  public async getArticles(
    pagination?: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<FAQArticle[]>> {
    return this.httpGet<FAQArticle[]>(
      this._route,
      pagination,
      undefined,
      options
    )
  }

  /**
   * get faq article
   */
  public async getArticle(
    id: FAQArticle['id'],
    options: ServiceOptions = {}
  ): Promise<ApiResponse<FAQArticle | null>> {
    return this.httpGet<FAQArticle | null>(
      `${this._route}/article/${id}`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * get faq categories
   */
  public async getCategoryTree(
    options: ServiceOptions = {}
  ): Promise<ApiResponse<FAQCategory[]>> {
    return this.httpGet<FAQCategory[]>(
      `${this._route}/category/tree`,
      undefined,
      undefined,
      options
    )
  }

  public async getCategoryTreeWithArticles(
    options: ServiceOptions = {}
  ): Promise<ApiResponse<FAQCategory[]>> {
    return this.httpGet<FAQCategory[]>(
      `${this._route}/category/tree/article`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * search categories
   */
  public async searchCategories(
    pagination: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<FAQCategory[]>> {
    return this.httpGet<FAQCategory[]>(
      `${this._route}/category/search`,
      pagination,
      undefined,
      options
    )
  }

  /**
   * create article
   */
  public async createArticle(
    data: Omit<FAQArticle, 'id'>,
    options: ServiceOptions = {}
  ): Promise<void> {
    return this.httpPost<void>(this._route, data, undefined, options)
  }

  /**
   * update article
   */
  public async updateArticle(
    id: FAQArticle['id'],
    data: FAQArticle,
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
   * delete article
   */
  public async deleteArticle(
    id: FAQArticle['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpDelete(`${this._route}/${id}`, undefined, options)
  }

  /**
   * create category
   */
  public async createCategory(
    data: FAQArticle['category'],
    options: ServiceOptions = {}
  ): Promise<void> {
    return this.httpPost<void>(
      `${this._route}/category`,
      data,
      undefined,
      options
    )
  }

  /**
   * update category
   */
  public async updateCategory(
    id: FAQArticle['id'],
    data: FAQArticle['category'],
    options: ServiceOptions = {}
  ): Promise<void> {
    return this.httpPatch<void>(
      `${this._route}/category/${id}`,
      data,
      undefined,
      options
    )
  }

  /**
   * delete category
   */
  public async deleteCategory(
    id: FAQArticle['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpDelete(`${this._route}/category/${id}`, undefined, options)
  }
}
