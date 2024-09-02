import type { Context } from '@/core/context/Context'
import { ApiService, type ServiceOptions } from '@/core/services/ApiService'
import type {
  AssignedWork,
  AssignedWorkProgress
} from '@/core/data/entities/AssignedWork'
import type { Pagination } from '@/core/data/Pagination'
import type { Work } from '@/core/data/entities/Work'

/**
 * AssignedWork service
 */
export class AssignedWorkService extends ApiService {
  private _route = '/assigned-work' as const

  /**
   * constructor
   */
  public constructor(context: Context) {
    super(context)
  }

  /**
   * Get assigned work
   */
  public async getAssignedWork(
    id: AssignedWork['id'],
    options: ServiceOptions = {}
  ) {
    return await this.httpGet<AssignedWork>(
      `${this._route}/${id}`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Get assigned work progress
   *
   * @param workId !!! This is a work id, not an assigned work id
   */
  public async getAssignedWorkProgress(
    workId: Work['id'],
    options: ServiceOptions = {}
  ) {
    return await this.httpGet<AssignedWorkProgress>(
      `${this._route}/progress/${workId}`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Get assigned works
   */
  public async getAssignedWorks(
    pagination: Pagination,
    options: ServiceOptions = {}
  ) {
    return await this.httpGet<AssignedWork[]>(
      `${this._route}`,
      pagination,
      undefined,
      options
    )
  }

  /**
   * Get assigned works from user
   */
  public async getAssignedWorksFromUser(
    userId: string,
    pagination?: Pagination,
    options: ServiceOptions = {}
  ) {
    return await this.httpGet<AssignedWork[]>(
      `${this._route}/from-user/${userId}`,
      pagination,
      undefined,
      options
    )
  }

  /**
   * Create assigned work
   */
  public async createAssignedWork(
    data: AssignedWork,
    options: ServiceOptions = {}
  ) {
    await this.httpPost(`${this._route}`, data, undefined, options)
  }

  /**
   * Remake assigned work
   */
  public async remakeAssignedWork(
    id: AssignedWork['id'],
    onlyFalse: boolean = false,
    options: ServiceOptions = {}
  ) {
    await this.httpPost(
      `${this._route}/${id}/remake`,
      { onlyFalse },
      undefined,
      options
    )
  }

  /**
   * Get or create assigned work
   */
  public async getOrCreateAssignedWork(
    materialSlug: string,
    options: ServiceOptions = {}
  ) {
    return await this.httpPost<{ link: string }>(
      `${this._route}/${materialSlug}`,
      undefined,
      {},
      options
    )
  }

  /**
   * Archive assigned work
   */
  public async archiveAssignedWork(
    id: AssignedWork['id'],
    options?: ServiceOptions
  ) {
    await this.httpPatch(
      `${this._route}/${id}/archive`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Archive assigned work
   */
  public async unarchiveAssignedWork(
    id: AssignedWork['id'],
    options?: ServiceOptions
  ) {
    await this.httpPatch(
      `${this._route}/${id}/unarchive`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Solve assigned work
   */
  public async solveAssignedWork(
    id: AssignedWork['id'],
    data: Partial<AssignedWork>,
    options: ServiceOptions = {}
  ) {
    await this.httpPatch(`${this._route}/${id}/solve`, data, undefined, options)
  }

  /**
   * Check assigned work
   */
  public async checkAssignedWork(
    id: AssignedWork['id'],
    data: Partial<AssignedWork>,
    options: ServiceOptions = {}
  ) {
    await this.httpPatch(`${this._route}/${id}/check`, data, undefined, options)
  }

  /**
   * Recheck assigned work
   */
  public async recheckAutomatically(
    id: AssignedWork['id'],
    options: ServiceOptions = {}
  ) {
    await this.httpPatch(
      `${this._route}/${id}/recheck-automatically`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Save assigned work progress
   */
  public async saveAssignedWorkProgress(
    id: AssignedWork['id'],
    data: Partial<AssignedWork>,
    options: ServiceOptions = {}
  ) {
    await this.httpPatch(`${this._route}/${id}/save`, data, undefined, options)
  }

  /**
   * Transfer the assigned work to another mentor
   */
  public async transferAssignedWork(
    assignedWorkId: AssignedWork['id'],
    mentorId: string,
    options: ServiceOptions = {}
  ) {
    await this.httpPatch(
      `${this._route}/${assignedWorkId}/transfer/${mentorId}`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Change the mentor of the assigned work
   */
  public async changeMentor(
    assignedWorkId: AssignedWork['id'],
    mentorId: string,
    options: ServiceOptions = {}
  ) {
    await this.httpPatch(
      `${this._route}/${assignedWorkId}/replace-mentor/${mentorId}`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Shift the deadline of the assigned work
   */
  public async shiftAssignedWorkDeadline(
    assignedWorkId: AssignedWork['id'],
    options: ServiceOptions = {}
  ) {
    await this.httpPatch(
      `${this._route}/${assignedWorkId}/shift-deadline`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Send the assigned work for revision back to student
   */
  public async sendToRevision(
    assignedWorkId: AssignedWork['id'],
    options: ServiceOptions = {}
  ) {
    await this.httpPatch(
      `${this._route}/${assignedWorkId}/send-to-revision`,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Delete the assigned work
   */
  public async deleteAssignedWork(
    assignedWorkId: AssignedWork['id'],
    options: ServiceOptions = {}
  ) {
    await this.httpDelete(
      `${this._route}/${assignedWorkId}`,
      undefined,
      options
    )
  }
}
