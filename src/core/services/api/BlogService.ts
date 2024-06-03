import type { Pagination } from './../../data/Pagination'
import type { Context } from '@/core/context/Context'
import type { BlogPost, Reaction } from '@/core/data/entities/BlogPost'
import { ApiService, type ApiResponse } from '@/core/services/ApiService'

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
    pagination?: Pagination
  ): Promise<ApiResponse<BlogPost[]>> {
    return await this.httpGet(this._route, pagination)
  }

  /**
   * Get post
   */
  public async getPost(
    id: BlogPost['id']
  ): Promise<ApiResponse<BlogPost | null>> {
    return await this.httpGet(`${this._route}/${id}`)
  }

  /**
   * Toggle reaction ion post
   */
  public async toggleReaction(
    id: BlogPost['id'],
    reaction: Reaction
  ): Promise<ApiResponse<BlogPost['reactionCounts'] | null>> {
    return await this.httpPatch<BlogPost['reactionCounts']>(
      `${this._route}/${id}/react/${reaction}`
    )
  }

  /**
   * Create post
   */
  public async createPost(
    event: BlogPost
  ): Promise<ApiResponse<BlogPost | null>> {
    return await this.httpPost(this._route, event)
  }

  /**
   * Update post
   */
  public async updatePost(id: BlogPost['id'], post: BlogPost): Promise<void> {
    await this.httpPatch(`${this._route}/${id}`, post)
  }

  /**
   * Delete post
   */
  public async deletePost(id: BlogPost['id']): Promise<void> {
    await this.httpDelete(`${this._route}/${id}`)
  }
}
