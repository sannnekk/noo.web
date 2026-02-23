import type { Video } from '@/core/data/entities/Video'
import {
  ApiService,
  type ApiResponse,
  type ServiceOptions
} from '../ApiService'
import type { Pagination } from '@/core/data/Pagination'
import type { VideoComment } from '@/core/data/entities/VideoComment'
import type { User } from '@/core/data/entities/User'
import type { Course } from '@/core/data/entities/Course'

export interface VideoAccessInfo {
  type: Video['accessType']
  text: string
  link?: string
  user?: User
  course?: Course
}

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
  ): Promise<ApiResponse<{ uploadUrl: string; id: string } | null>> {
    return this.httpPost<{ uploadUrl: string; id: string }>(
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
   * Publish video
   */
  public async publish(
    videoId: Video['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    return this.httpPost<void>(
      `${this._route}/${videoId}/publish`,
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
   * Add video to saved videos
   */
  public async addToSavedVideos(
    videoId: Video['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    return this.httpPatch<void>(
      `${this._route}/${videoId}/add-to-saved`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Remove video from saved videos
   */
  public async removeFromSavedVideos(
    videoId: Video['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    return this.httpPatch<void>(
      `${this._route}/${videoId}/remove-from-saved`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Check if video is saved
   */
  public async isSaved(
    videoId: Video['id'],
    options: ServiceOptions = {}
  ): Promise<ApiResponse<boolean | null>> {
    return this.httpGet<boolean>(
      `${this._route}/${videoId}/is-saved`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Get saved videos
   */
  public async getSavedVideos(
    pagination?: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<Video[]>> {
    return this.httpGet<Video[]>(
      `${this._route}/saved`,
      pagination,
      undefined,
      options
    )
  }

  /**
   * Toggle video reaction
   */
  public async toggleReaction(
    videoId: Video['id'],
    reaction: string,
    options: ServiceOptions = {}
  ) {
    return this.httpPost<Video['reactions']>(
      `${this._route}/${videoId}/reaction`,
      { reaction },
      undefined,
      options
    )
  }

  public async getAccessInfo(
    videoId: Video['id'],
    options: ServiceOptions = {}
  ) {
    return this.httpGet<VideoAccessInfo>(
      `${this._route}/${videoId}/access-info`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Get video comments
   */
  public async getVideoComments(
    videoId: Video['id'],
    pagination?: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<VideoComment[]>> {
    return this.httpGet<VideoComment[]>(
      `${this._route}/${videoId}/comment`,
      pagination,
      undefined,
      options
    )
  }

  /**
   * Create a comment
   */
  public async createComment(
    videoId: Video['id'],
    text: string,
    options: ServiceOptions = {}
  ): Promise<void> {
    return this.httpPost<void>(
      `${this._route}/${videoId}/comment`,
      { text },
      undefined,
      options
    )
  }

  /**
   * Delete comment
   */
  public async deleteComment(
    comentId: VideoComment['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpDelete(
      `${this._route}/comment/${comentId}`,
      undefined,
      options
    )
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
