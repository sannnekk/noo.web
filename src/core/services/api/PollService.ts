import type { Pagination } from './../../data/Pagination'
import type { Context } from '@/core/context/Context'
import type { BlogPost } from '@/core/data/entities/BlogPost'
import type { Poll } from '@/core/data/entities/Poll'
import type { PollAnswer } from '@/core/data/entities/PollAnswer'
import type { User } from '@/core/data/entities/User'
import {
  ApiService,
  type ApiResponse,
  type ServiceOptions
} from '@/core/services/ApiService'

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
   * Get polls
   */
  public async getPolls(
    pagination?: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<Poll[]>> {
    return await this.httpGet(this._route, pagination, undefined, options)
  }

  /**
   * Create poll
   */
  public async createPoll(
    poll: Poll,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<Poll | null>> {
    return await this.httpPost(this._route, poll, undefined, options)
  }

  /**
   * Update poll
   */
  public async updatePoll(
    id: Poll['id'],
    poll: Poll,
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpPatch(`${this._route}/${id}`, poll, undefined, options)
  }

  /**
   * Get poll questions
   */
  public async getPollQuestions(
    pagination?: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<Poll[]>> {
    return await this.httpGet(
      `${this._route}/question`,
      pagination,
      undefined,
      options
    )
  }

  /**
   * Get poll
   */
  public async getPoll(
    id: BlogPost['id'],
    options: ServiceOptions = {}
  ): Promise<ApiResponse<Poll | null>> {
    return await this.httpGet(
      `${this._route}/${id}`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Get poll info
   */
  public async getPollInfo(
    id: Poll['id'],
    options: ServiceOptions = {}
  ): Promise<ApiResponse<Poll | null>> {
    return await this.httpGet(
      `${this._route}/${id}/info`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Save answers
   */
  public async saveAnswers(
    pollId: Poll['id'],
    answers: PollAnswer[],
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpPost(
      `${this._route}/${pollId}/answer`,
      answers,
      undefined,
      options
    )
  }

  /**
   * Search who voted
   */
  public async searchWhoVoted(
    pollId: Poll['id'],
    pagination?: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<PollAnswer[]>> {
    return await this.httpGet(
      `${this._route}/${pollId}/user`,
      pagination,
      undefined,
      options
    )
  }

  /**
   * Search who voted (unregistered users)
   */
  public async searchWhoVotedUnregistered(
    pollId: Poll['id'],
    pagination?: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<PollAnswer[]>> {
    return await this.httpGet(
      `${this._route}/${pollId}/unregistered`,
      pagination,
      undefined,
      options
    )
  }

  /**
   * Get answers
   */
  public async getAnswers(
    pollId: Poll['id'],
    userId: User['id'],
    options: ServiceOptions = {}
  ): Promise<ApiResponse<PollAnswer[]>> {
    return await this.httpGet(
      `${this._route}/${pollId}/user/${userId}/answer`,
      undefined,
      undefined,
      options
    )
  }

  /*
   * Edit answer
   */
  public async editAnswer(
    answerId: PollAnswer['id'],
    answer: PollAnswer,
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpPatch(
      `${this._route}/answer/${answerId}`,
      answer,
      undefined,
      options
    )
  }

  /**
   * Get my polls
   */
  public async getMyPolls(
    pagination?: Pagination,
    options: ServiceOptions = {}
  ): Promise<ApiResponse<Poll[]>> {
    return await this.httpGet(
      `${this._route}/my`,
      pagination,
      undefined,
      options
    )
  }

  /**
   * Delete poll
   */
  public async deletePoll(
    pollId: Poll['id'],
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpDelete(`${this._route}/${pollId}`, undefined, options)
  }
}
