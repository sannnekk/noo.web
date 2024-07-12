import type { FilterType, Pagination } from '../data/Pagination'
import { Constants } from '../constants'
import { Service } from './Service'
import type { Media } from '../data/entities/Media'

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
    params = {} as Pagination,
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
  protected uploadFiles(files: File[], progress: (progress: number) => void) {
    return new Promise<ApiResponse<Media[]>>((resolve, reject) => {
      const formData = new FormData()

      for (const file of files) {
        formData.append('files', file)
      }

      const request = new XMLHttpRequest()

      request.open('POST', `${Constants.API_URL}/media`, true)

      request.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          progress.call(
            undefined,
            Math.round((event.loaded / event.total) * 100)
          )
        }
      })

      request.addEventListener('error', () => {
        reject({
          status: 400,
          message: 'Неизвестная ошибка'
        })
      })

      request.addEventListener('abort', () => {
        reject({ status: 0, message: 'Загрузка отменена' })
      })

      request.addEventListener('load', () => {
        if (request.status < 400) {
          try {
            resolve(JSON.parse(request.responseText))
          } catch (error) {
            reject({
              status: request.status,
              message: 'Неизвестная ошибка'
            })
          }
        } else {
          try {
            reject({
              status: request.status,
              message:
                JSON.parse(request.responseText)?.error || 'Неизвестная ошибка'
            })
          } catch (error) {
            reject({
              status: request.status,
              message: 'Неизвестная ошибка'
            })
          }
        }
      })

      request.setRequestHeader(
        'Authorization',
        `Bearer ${this._context.ApiToken}`
      )

      request.send(formData)
    })
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
      headers: this._getHeaders(
        additionalHeaders,
        body instanceof FormData ? 'form' : 'json'
      ),
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
        if (this._context.isInitialized()) {
          this._context.Events.emit('global:retry-login', this._context)
        } else {
          this._context.Events.emit('global:logout', this._context)
        }
      }

      throw error
    }
  }

  /**
   * Get basic headers
   */
  private _getHeaders(
    additionalHeaders: Record<string, string>,
    contentType: 'json' | 'form' = 'json'
  ) {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this._context.ApiToken}`,
      ...additionalHeaders
    }

    if (contentType === 'json') {
      headers['Content-Type'] = 'application/json'
    }

    return headers
  }

  /**
   * Get url params
   */
  private _getParams(params: Pagination) {
    const relations = params.relations || []

    const nonFilterParams = Object.keys(params)
      .filter((param) => !param.startsWith('filter[') && param !== 'relations')
      .reduce((acc, key) => {
        acc[key as any] = params[key as any]
        return acc
      }, {} as Pagination)

    let filters = Object.keys(params).filter((param) =>
      param.startsWith('filter[')
    )

    filters = filters.filter((filter) => {
      if (params[filter as any] === undefined) {
        return false
      }

      if (Array.isArray(params[filter as any].value)) {
        // @ts-ignore
        return params[filter].value.length > 0
      }

      return true
    })

    let query = new URLSearchParams(
      nonFilterParams as unknown as Record<string, string>
    ).toString()

    for (const filter of filters) {
      query += `&${filter}=${this._stringifyFilter(
        params[filter as any] as FilterType
      )}`
    }

    for (const relation of relations) {
      query += `&relations[]=${relation}`
    }

    console.log(params, query)

    return query
  }

  /**
   * Stringify filter
   */
  private _stringifyFilter(filter: FilterType) {
    switch (filter.type) {
      case 'range':
        return `range(${this._stringifyType(
          filter.value[0]
        )}|${this._stringifyType(filter.value[1])})`
      case 'arr':
        return `arr(${filter.value.map(this._stringifyType).join('|')})`
      case 'tags':
        return `tags(${filter.value.map(this._stringifyType).join('|')})`
      case 'string':
      case 'number':
      case 'boolean':
      case 'null':
      default:
        return this._stringifyType(filter.value)
    }
  }

  /**
   * Stringify type
   */
  private _stringifyType(value: string | Date | number | boolean | null) {
    if (value === null) {
      return 'null'
    }

    if (value instanceof Date) {
      return value.toISOString()
    }

    return value.toString()
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
