import { ApiService, type ServiceOptions } from '../ApiService'

// Shpuntik (AI) requests can take up to 5 minutes
const SHPUNTIK_TIMEOUT = 5 * 60 * 1000

export class ShpuntikService extends ApiService {
  private _route = '/shpuntik' as const

  public async checkTask(
    workId: string,
    taskId: string,
    options: ServiceOptions = {}
  ): Promise<void> {
    return this.httpPost<void>(
      `${this._route}/check/${workId}/${taskId}`,
      undefined,
      undefined,
      { timeout: SHPUNTIK_TIMEOUT, ...options }
    )
  }

  public async removeComment(
    workId: string,
    taskId: string,
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpDelete(
      `${this._route}/comment/${workId}/${taskId}`,
      undefined,
      { timeout: SHPUNTIK_TIMEOUT, ...options }
    )
  }
}
