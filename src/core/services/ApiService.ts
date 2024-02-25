import type { Pagination } from '../data/Pagination'
import { Constants } from '../constants'
import { Service } from './Service'

type ApiRoute = `/${string}`

export interface ApiResponse<T> {
  data: T
  meta?: ResponseMeta
  error?: string
}

export interface ResponseMeta {
  total: number
  relations: string[]
}

/**
 * Api service
 */
export class ApiService extends Service {
  /**
   * Api get request
   */
  protected httpGet<T>(
    route: ApiRoute,
    params = {} as { [key: string]: string | number | undefined },
    additionalHeaders = {} as { [key: string]: string }
  ) {
    const url: ApiRoute = `${route}?${this._getParams(params)}`
    return this._httpRequest<T>('GET', url, undefined, additionalHeaders)
  }

  /**
   * Api post request
   */
  protected httpPost<T>(
    route: ApiRoute,
    body = {} as { [key: string]: any },
    additionalHeaders = {} as { [key: string]: string }
  ) {
    return this._httpRequest<T>('POST', route, body, additionalHeaders)
  }

  /**
   * Api patch request
   */
  protected httpPatch<T>(
    route: ApiRoute,
    body = {} as { [key: string]: any },
    additionalHeaders = {} as { [key: string]: string }
  ) {
    return this._httpRequest<T>('PATCH', route, body, additionalHeaders)
  }

  /**
   * Api delete request
   */
  protected httpDelete(
    route: ApiRoute,
    additionalHeaders = {} as { [key: string]: string }
  ) {
    return this._httpRequest('DELETE', route, undefined, additionalHeaders)
  }

  /**
   * Upload files request
   */
  protected uploadFiles(
    files: File[],
    additionalHeaders = {} as { [key: string]: string }
  ) {
    const formData = new FormData()

    for (const file of files) {
      formData.append('files', file)
    }

    return this.httpPost<{ links: string[] }>(
      '/media',
      formData,
      additionalHeaders
    )
  }

  /**
   * Http request
   * @throws {{status?: number, message: string}} error
   */
  private async _httpRequest<T = null>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    route: ApiRoute,
    body?: any,
    additionalHeaders = {} as { [key: string]: string }
  ): Promise<
    T extends void
      ? void
      : ApiResponse<T | (T extends Array<any> ? never : null)>
  > {
    const url = `${Constants.API_URL}${route}`

    const options: RequestInit = {
      method,
      headers: this._getHeaders(additionalHeaders),
      body: this._getBody(body)
    }

    try {
      const response = await fetch(url, options)

      const result = await response.text()

      if (!response.ok)
        throw { status: response.status, message: JSON.parse(result).error }

      if (!result) return undefined as T extends void ? void : ApiResponse<T>

      return JSON.parse(result, (_, value) =>
        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
          ? new Date(value)
          : value
      )
    } catch (error: any) {
      if (error.status === 401) {
        this._context.Events.emit('global:logout')

        return undefined as T extends void ? void : ApiResponse<T>
      }

      throw {
        status: error.status,
        message: error.message || 'Неизвестная ошибка'
      }
    }
  }

  /**
   * Get basic headers
   */
  private _getHeaders(
    additionalHeaders: Record<string, string>,
    contextType: 'json' | 'form' = 'json'
  ) {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this._context.ApiToken}`,
      ...additionalHeaders
    }

    if (contextType === 'json') {
      headers['Content-Type'] = 'application/json'
    }

    return headers
  }

  /**
   * Get url params
   */
  private _getParams(params: Record<string, string | number | undefined>) {
    return new URLSearchParams(params as Record<string, string>).toString()
  }

  /**
   * Get body
   */
  private _getBody(body: Record<string, any> | FormData | undefined) {
    if (!body) {
      return undefined
    }

    if (body instanceof FormData) {
      return body
    }

    return JSON.stringify(body)
  }
}
