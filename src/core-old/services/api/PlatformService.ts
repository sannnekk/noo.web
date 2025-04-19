import type { Context } from '@/core/context/Context'
import { ApiService } from '../ApiService'
import type { ChangelogItem } from '@/core/data/system/Changelog'
import type { HealthCheckResult } from '@/core/data/system/HealthCheckResult'

export class PlatformService extends ApiService {
  private _route = '/platform' as const

  public constructor(context: Context) {
    super(context)
  }

  /**
   * Get platform version
   */
  public async getVersion() {
    return this.httpGet<string>(`${this._route}/version`)
  }

  /**
   * Get changelog for specific version
   */
  public async getChangelogForVersion(version: string) {
    return this.httpGet<ChangelogItem>(`${this._route}/changelog/${version}`)
  }

  /**
   * Get changelog
   */
  public async getChangelog() {
    return this.httpGet<ChangelogItem[]>(`${this._route}/changelog`)
  }

  /**
   * Make a healthcheck
   */
  public async healthcheck() {
    return this.httpGet<HealthCheckResult[]>(`${this._route}/healthcheck`)
  }
}
