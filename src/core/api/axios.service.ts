import axios, {
  isAxiosError,
  type AxiosInstance,
  type AxiosRequestConfig
} from 'axios'
import { appConfig } from '../config/app.config'
import { ApiResponse } from './api-response.data'

export type AccessTokenFactory = () => Promise<string>

export interface RequestProgressEvent {
  percent: number
  bytesTransferred: number
  totalBytes: number
  timeLeft: number
}

export interface RequestConfig {
  queryParams?: Record<string, string | number | boolean>
  onUploadProgress?: (progressEvent?: RequestProgressEvent) => void
  onDownloadProgress?: (progressEvent?: RequestProgressEvent) => void
  abortController?: AbortController
}

class AxiosClass {
  private static instance: AxiosInstance | null = null

  private tokenFactory?: AccessTokenFactory

  constructor(tokenFactory?: AccessTokenFactory) {
    this.tokenFactory = tokenFactory

    if (!AxiosClass.instance) {
      this.init()
    }
  }

  private init() {
    AxiosClass.instance = axios.create({
      baseURL: appConfig.apiUrl + '/',
      timeout: appConfig.apiConnectTimeoutSeconds * 1000,
      allowAbsoluteUrls: false
    })

    AxiosClass.instance.interceptors.response.use(undefined, (error) => {
      const response = this.handleResponseError(error)
      return Promise.reject(response)
    })
  }

  public setTokenFactory(tokenFactory: AccessTokenFactory) {
    this.tokenFactory = tokenFactory
  }

  public async get<TResponse>(
    path: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<TResponse>> {
    const response = await AxiosClass.instance!.get(
      path,
      this.mergeWithDefaultConfig(config)
    )

    return new ApiResponse(response.data, response.status, response.headers)
  }

  public async post<TRequest, TResponse>(
    path: string,
    data: TRequest,
    config: RequestConfig = {}
  ): Promise<ApiResponse<TResponse>> {
    const response = await AxiosClass.instance!.post(
      path,
      data,
      this.mergeWithDefaultConfig(config)
    )

    return new ApiResponse(response.data, response.status, response.headers)
  }

  public async patch<TRequest, TResponse>(
    path: string,
    data: TRequest,
    config: RequestConfig = {}
  ): Promise<ApiResponse<TResponse>> {
    const response = await AxiosClass.instance!.patch(
      path,
      data,
      this.mergeWithDefaultConfig(config)
    )

    return new ApiResponse(response.data, response.status, response.headers)
  }

  public async delete<TResponse>(
    path: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<TResponse>> {
    const response = await AxiosClass.instance!.delete(
      path,
      this.mergeWithDefaultConfig(config)
    )

    return new ApiResponse(response.data, response.status, response.headers)
  }

  public async file<T>(
    path: string,
    data: File[],
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const response = await AxiosClass.instance!.postForm(path, data, {
      ...this.mergeWithDefaultConfig(config),
      headers: {
        ...this.mergeWithDefaultConfig(config).headers,
        'Content-Type': 'multipart/form-data'
      }
    })

    return new ApiResponse(response.data, response.status, response.headers)
  }

  private mergeWithDefaultConfig(config: RequestConfig): AxiosRequestConfig {
    const defaultConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'X-Front-Version': appConfig.currentVersion,
        Accept: 'application/json'
      }
    }

    if (this.tokenFactory) {
      defaultConfig.headers!['Authorization'] = `Bearer ${this.tokenFactory()}`
    }

    if (config.queryParams) {
      defaultConfig.params = config.queryParams
    }

    if (config.abortController) {
      defaultConfig.signal = config.abortController.signal
    }

    if (config.onUploadProgress) {
      defaultConfig.onUploadProgress
    }

    if (config.onDownloadProgress) {
      defaultConfig.onDownloadProgress
    }

    return defaultConfig
  }

  private handleResponseError(error: unknown): ApiResponse {
    const response = new ApiResponse()

    if (isAxiosError(error) && error.request) {
      response.setNetworkError()
    } else if (isAxiosError(error) && error.response) {
      response.setError(
        error.response.data,
        error.response.status,
        error.response.headers
      )
    } else {
      response.setUnknownError()
    }

    return response
  }
}

export const Axios = new AxiosClass()

export type Axios = AxiosClass
