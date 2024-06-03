import type { Pagination } from './../../data/Pagination'
import type { Context } from '@/core/context/Context'
import type { BlogPost, Reaction } from '@/core/data/entities/BlogPost'
import type { Poll } from '@/core/data/entities/Poll'
import type { PollAnswer } from '@/core/data/entities/PollAnswer'
import type { User } from '@/core/data/entities/User'
import { ApiService, type ApiResponse } from '@/core/services/ApiService'

/**
 * Poll service
 */
export class PollService extends ApiService {
  private _route = '/poll' as const

  /**
   * constructor
   */
  public constructor(context: Context) {
    super(context)
  }

  /**
   * Get poll
   */
  public async getPoll(id: BlogPost['id']): Promise<ApiResponse<Poll | null>> {
    return await this.httpGet(`${this._route}/${id}`)
  }

  /**
   * Get poll info
   */
  public async getPollInfo(id: Poll['id']): Promise<ApiResponse<Poll | null>> {
    return await this.httpGet(`${this._route}/${id}/info`)
  }

  /**
   * Save answers
   */
  public async saveAnswers(
    pollId: Poll['id'],
    answers: PollAnswer[]
  ): Promise<void> {
    await this.httpPost(`${this._route}/${pollId}/answer`, answers)
  }

  /**
   * Search who voted
   */
  public async searchWhoVoted(
    pollId: Poll['id'],
    pagination?: Pagination
  ): Promise<ApiResponse<PollAnswer[]>> {
    return await this.httpGet(`${this._route}/${pollId}/user`, pagination)
  }

  /**
   * Get answers
   */
  public async getAnswers(
    pollId: Poll['id'],
    userId: User['id']
  ): Promise<ApiResponse<PollAnswer[]>> {
    return await this.httpGet(`${this._route}/${pollId}/user/${userId}/answer`)
  }

  /*
   * Edit answer
   */
  public async editAnswer(
    answerId: PollAnswer['id'],
    answer: PollAnswer
  ): Promise<void> {
    await this.httpPatch(`${this._route}/answer/${answerId}`, answer)
  }
}
