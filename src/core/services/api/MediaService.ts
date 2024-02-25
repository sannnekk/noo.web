import type { Context } from '@/core/context/Context'
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
  public upload(
    files: File[]
  ): Promise<ApiResponse<{ links: string[] } | null>> {
    return this.uploadFiles(files)
  }
}
