import type { Context } from '@/core/context/Context'
import { ApiService, type ApiResponse } from '@/core/services/ApiService'
import { ref, type Ref } from 'vue'

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
  ): Promise<ApiResponse<{ links: string[] } | null>> {
    return await this.uploadFiles(files, progress)
  }
}
