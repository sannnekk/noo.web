import type { Pagination } from '@/core/data/Pagination'
import {
  ApiService,
  type ApiResponse,
  type ServiceOptions
} from '../ApiService'
import type { Table } from '@/core/data/entities/Table'

export class TableService extends ApiService {
  private _route = '/table' as const

  /**
   * get tables
   *
   */
  public async getTables(
    pagination?: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<Table[]>> {
    return this.httpGet<Table[]>(this._route, pagination, undefined, options)
  }

  /**
   * get table
   *
   */
  public async getTable(
    id: Table['id'],
    options: ServiceOptions = {}
  ): Promise<ApiResponse<Table | null>> {
    return this.httpGet<Table | null>(
      `${this._route}/${id}`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * create a table
   */
  public async createTable(
    data: Omit<Table, 'id'>,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<Table | null>> {
    return this.httpPost<Table>(this._route, data, undefined, options)
  }

  /**
   * update a table
   */
  public async updateTable(
    id: Table['id'],
    data: Table,
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
   * delete table
   */
  public async deleteTable(
    id: Table['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpDelete(`${this._route}/${id}`, undefined, options)
  }
}
