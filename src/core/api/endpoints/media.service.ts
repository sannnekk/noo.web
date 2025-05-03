import { type ApiResponse, Api } from '../api.utils'
import type { MediaEntity } from './media.types'

interface MediaService {
  upload: (file: File) => Promise<ApiResponse<MediaEntity>>
  delete: (mediaId: string) => Promise<ApiResponse>
}

async function upload(file: File): Promise<ApiResponse<MediaEntity>> {
  return await Api.fileUpload('/media/upload', [file])
}

async function deleteMedia(mediaId: string): Promise<ApiResponse> {
  return await Api.delete(`/media/${mediaId}`)
}

export const MediaService: MediaService = {
  upload,
  delete: deleteMedia
}
