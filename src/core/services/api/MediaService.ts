import type { Context } from '@/core/context/Context'
import type { MediaFile } from '@/core/data/MediaFile'
import { ApiService, type ApiResponse } from '@/core/services/ApiService'

/**
 * Media service
 */
export class MediaService extends ApiService {
  /**
   * constructor
   */
  public constructor(context: Context) {
    super(context)
  }

  /**
   * Upload files
   */
  public async upload(
    files: File[],
    progress: (progress: number) => void = () => {}
  ): Promise<ApiResponse<MediaFile[] | null>> {
    return this.uploadFiles(files, progress)
  }
}
