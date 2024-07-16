import type { Context } from '@/core/context/Context'
import { ApiService } from '@/core/services/ApiService'
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { Pagination } from '@/core/data/Pagination'

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
  public async getAssignedWork(id: AssignedWork['id']) {
    return await this.httpGet<AssignedWork>(`${this._route}/${id}`)
  }

  /**
   * Get assigned works
   */
  public async getAssignedWorks(pagination: Pagination) {
    return await this.httpGet<AssignedWork[]>(`${this._route}`, pagination)
  }

  public async getAssignedWorksFromUser(
    userId: string,
    pagination?: Pagination
  ) {
    return await this.httpGet<AssignedWork[]>(
      `${this._route}/from-user/${userId}`,
      pagination
    )
  }

  /**
   * Create assigned work
   */
  public async createAssignedWork(data: AssignedWork) {
    await this.httpPost(`${this._route}`, data)
  }

  public async remakeAssignedWork(
    id: AssignedWork['id'],
    onlyFalse: boolean = false
  ) {
    await this.httpPost(`${this._route}/${id}/remake`, { onlyFalse })
  }

  /**
   * Get or create assigned work
   */
  public async getOrCreateAssignedWork(materialSlug: string) {
    return await this.httpPost<{ link: string }>(
      `${this._route}/${materialSlug}`
    )
  }

  /**
   * Archive assigned work
   */
  public async archiveAssignedWork(id: AssignedWork['id']) {
    await this.httpPatch(`${this._route}/${id}/archive`)
  }

  /**
   * Archive assigned work
   */
  public async unarchiveAssignedWork(id: AssignedWork['id']) {
    await this.httpPatch(`${this._route}/${id}/unarchive`)
  }

  /**
   * Solve assigned work
   */
  public async solveAssignedWork(
    id: AssignedWork['id'],
    data: Partial<AssignedWork>
  ) {
    await this.httpPatch(`${this._route}/${id}/solve`, data)
  }

  /**
   * Check assigned work
   */
  public async checkAssignedWork(
    id: AssignedWork['id'],
    data: Partial<AssignedWork>
  ) {
    await this.httpPatch(`${this._route}/${id}/check`, data)
  }

  public async saveAssignedWorkProgress(
    id: AssignedWork['id'],
    data: Partial<AssignedWork>
  ) {
    await this.httpPatch(`${this._route}/${id}/save`, data)
  }

  /**
   * Transfer the assigned work to another mentor
   */
  public async transferAssignedWork(
    assignedWorkId: AssignedWork['id'],
    mentorId: string
  ) {
    await this.httpPatch(
      `${this._route}/${assignedWorkId}/transfer/${mentorId}`
    )
  }

  /**
   * Change the mentor of the assigned work
   */
  public async changeMentor(
    assignedWorkId: AssignedWork['id'],
    mentorId: string
  ) {
    await this.httpPatch(
      `${this._route}/${assignedWorkId}/replace-mentor/${mentorId}`
    )
  }

  /**
   * Shift the deadline of the assigned work
   */
  public async shiftAssignedWorkDeadline(assignedWorkId: AssignedWork['id']) {
    await this.httpPatch(`${this._route}/${assignedWorkId}/shift-deadline`)
  }

  /**
   * Delete the assigned work
   */
  public async deleteAssignedWork(assignedWorkId: AssignedWork['id']) {
    await this.httpDelete(`${this._route}/${assignedWorkId}`)
  }
}
