import type { Video } from '@/core/data/entities/Video'
import {
  ApiService,
  type ApiResponse,
  type ServiceOptions
} from '../ApiService'
import type { Pagination } from '@/core/data/Pagination'

export class VideoService extends ApiService {
  private _route = '/video' as const

  /**
   * Get video by id
   */
  public async getVideo(
    id: Video['id'],
    options: ServiceOptions = {}
  ): Promise<ApiResponse<Video | null>> {
    return this.httpGet<Video>(
      `${this._route}/${id}`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Get videos
   */
  public async getVideos(
    pagination?: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<Video[]>> {
    return this.httpGet<Video[]>(this._route, pagination, undefined, options)
  }

  /**
   * Create a video
   */
  public async createVideo(
    data: Omit<Video, 'id'>,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<{ uploadUrl: string } | null>> {
    return this.httpPost<{ uploadUrl: string }>(
      this._route,
      data,
      undefined,
      options
    )
  }

  /**
   * Finish video upload
   */
  public async finishUpload(
    videoId: Video['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    return this.httpPost<void>(
      `${this._route}/${videoId}/finish-upload`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Update video
   */
  public async updateVideo(
    id: Video['id'],
    data: Video,
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
   * Create a comment
   */
  public async createComment(
    videoId: Video['id'],
    content: string
  ): Promise<void> {
    return this.httpPost<void>(`${this._route}/${videoId}/comment`, { content })
  }

  /**
   * delete a video
   */
  public async deleteVideo(
    id: Video['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpDelete(`${this._route}/${id}`, undefined, options)
  }
}
