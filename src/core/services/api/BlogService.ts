import type { Pagination } from './../../data/Pagination'
import type { Context } from '@/core/context/Context'
import type { BlogPost, Reaction } from '@/core/data/entities/BlogPost'
import {
  ApiService,
  type ApiResponse,
  type ServiceOptions
} from '@/core/services/ApiService'

/**
 * Poll service
 */
export class BlogService extends ApiService {
  private _route = '/blog' as const

  /**
   * constructor
   */
  public constructor(context: Context) {
    super(context)
  }

  /**
   * Get posts
   */
  public async getPosts(
    pagination?: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<BlogPost[]>> {
    return await this.httpGet(this._route, pagination, undefined, options)
  }

  /**
   * Get post
   */
  public async getPost(
    id: BlogPost['id'],
    options: ServiceOptions = {}
  ): Promise<ApiResponse<BlogPost | null>> {
    return await this.httpGet(
      `${this._route}/${id}`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Toggle reaction ion post
   */
  public async toggleReaction(
    id: BlogPost['id'],
    reaction: Reaction,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<BlogPost['reactionCounts'] | null>> {
    return await this.httpPatch<BlogPost['reactionCounts']>(
      `${this._route}/${id}/react/${reaction}`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Create post
   */
  public async createPost(
    event: BlogPost,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<BlogPost | null>> {
    return await this.httpPost(this._route, event, undefined, options)
  }

  /**
   * Update post
   */
  public async updatePost(
    id: BlogPost['id'],
    post: BlogPost,
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpPatch(`${this._route}/${id}`, post, undefined, options)
  }

  /**
   * Delete post
   */
  public async deletePost(
    id: BlogPost['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpDelete(`${this._route}/${id}`, undefined, options)
  }
}
