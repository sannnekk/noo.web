import { shallowRef, type ShallowRef } from 'vue'
import type {
  ApiError,
  ApiMetadata,
  ApiResponse,
  RequestProgress
} from '../api/api.utils'

export interface UseApiRequestReturn<TRequest = void, TResponse = void> {
  data: ShallowRef<TResponse | null>
  metadata?: ShallowRef<ApiMetadata | null>
  error: ShallowRef<ApiError | null>
  isLoading: ShallowRef<boolean>
  progress: ShallowRef<number | null>
  execute: (payload: TRequest) => Promise<void>
}

function useApiRequest<TRequest = void, TResponse = void>(
  request: (
    payload: TRequest,
    onProgress?: (event: RequestProgress) => void
  ) => Promise<ApiResponse<TResponse>>,
  onSuccess?: (response: ApiResponse<TResponse>) => void,
  onError?: (error: ApiError) => void
): UseApiRequestReturn<TRequest, TResponse> {
  const data = shallowRef<TResponse | null>(null)
  const metadata = shallowRef<ApiMetadata | null>(null)
  const error = shallowRef<ApiError | null>(null)
  const isLoading = shallowRef<boolean>(false)
  const progress = shallowRef<number | null>(null)

  async function execute(payload: TRequest): Promise<void> {
    isLoading.value = true
    error.value = null
    data.value = null
    metadata.value = null

    const response = await request(payload, (event) => {
      if (event.total) {
        progress.value = Math.round((event.loaded / event.total) * 100)
      } else {
        progress.value = null
      }
    })

    data.value = response.data
    metadata.value = response.metadata || null
    error.value = response.error || null
    isLoading.value = false
    progress.value = null

    if (response.error) {
      if (onError) {
        onError(response.error)
      }

      return
    }

    if (onSuccess) {
      onSuccess(response)
    }
  }

  return {
    data,
    metadata,
    error,
    isLoading,
    progress,
    execute
  }
}

export { useApiRequest }
