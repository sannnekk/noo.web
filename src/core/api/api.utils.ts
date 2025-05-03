import axios from 'axios'
import { appConfig } from '../config/app.config'
import { CookieStorage } from '../utils/cookies.utils'
import { ApiErrorCodes } from './api-error-codes.data'
import { GlobalEventBus } from '../events/event-bus'

export interface ApiResponse<T = void> {
  data: T
  error?: ApiError
  metadata?: ApiMetadata
}

export interface ApiError {
  id: string
  logId?: string
  statusCode: number
  name: string
  description?: string
  payload: unknown
}

export interface ApiMetadata {
  total: number
}

export interface RequestProgress {
  loaded: number
  total?: number
  progress?: number
  bytes: number
  rate?: number
  estimated?: number
}

const api = axios.create({
  baseURL: appConfig.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = CookieStorage.get<string>(CookieStorage.StorageAliases.apiToken)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        if (CookieStorage.isSet(CookieStorage.StorageAliases.apiToken)) {
          GlobalEventBus.emit('auth:login-expired', undefined)
        } else {
          GlobalEventBus.emit('auth:logout', undefined)
        }
      }

      return Promise.reject({
        id: error.response.error?.id || 'UNKNOWN_ERROR',
        logId: error.response.error?.logId,
        statusCode: error.response.status,
        name:
          ApiErrorCodes[error.response.error?.id]?.name ||
          ApiErrorCodes.fallback.name,
        description:
          ApiErrorCodes[error.response.error?.id]?.description ||
          ApiErrorCodes.fallback.description,
        payload: error.response.error?.payload || null
      } as ApiError)
    }

    return Promise.reject({
      id: 'NETWORK_ERROR',
      statusCode: 0,
      name: ApiErrorCodes.NETWORK_ERROR.name,
      description: ApiErrorCodes.NETWORK_ERROR.description,
      payload: error
    } as ApiError)
  }
)

async function httpGet<T>(
  path: string,
  params?: Record<string, unknown>,
  headers?: Record<string, string>,
  onProgress?: (progressEvent: RequestProgress) => void
): Promise<ApiResponse<T>> {
  try {
    const response = await api.get(path, {
      params,
      headers,
      onDownloadProgress: (event) => onProgress?.(event)
    })
    return response.data
  } catch (error) {
    return error as ApiResponse<T>
  }
}

async function httpPost<TRequest, TResponse>(
  path: string,
  body?: TRequest,
  headers?: Record<string, string>,
  onProgress?: (progressEvent: RequestProgress) => void
): Promise<ApiResponse<TResponse>> {
  try {
    const response = await api.post(path, body, {
      headers,
      onUploadProgress: (event) => onProgress?.(event)
    })
    return response.data
  } catch (error) {
    return error as ApiResponse<TResponse>
  }
}

async function httpPatch<T>(
  path: string,
  body?: T,
  headers?: Record<string, string>,
  onProgress?: (progressEvent: RequestProgress) => void
): Promise<ApiResponse> {
  try {
    const response = await api.patch(path, body, {
      headers,
      onDownloadProgress: (event) => onProgress?.(event)
    })
    return response.data
  } catch (error) {
    return error as ApiResponse
  }
}

async function httpDelete(
  path: string,
  headers?: Record<string, string>
): Promise<ApiResponse> {
  try {
    return await api.delete(path, { headers })
  } catch (error) {
    return error as ApiResponse
  }
}

async function httpFileUpload<T>(
  path: string,
  body: File[],
  headers?: Record<string, string>,
  onProgress?: (progressEvent: RequestProgress) => void
): Promise<ApiResponse<T>> {
  try {
    const response = await api.post(path, body, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data'
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      onUploadProgress: (event) => onProgress?.(event)
    })
    return response.data
  } catch (error) {
    return error as ApiResponse<T>
  }
}

export const Api = {
  get: httpGet,
  post: httpPost,
  patch: httpPatch,
  delete: httpDelete,
  fileUpload: httpFileUpload
}
