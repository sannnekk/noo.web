import type { Context } from '@/core/context/Context'
import type { UserSettings } from '@/core/data/entities/UserSettings'
import { ApiService, type ServiceOptions } from '@/core/services/ApiService'
import { installUserSettingsStore } from './UserSettingsStore'

/**
 * Notification service
 */
export class UserSettingsService extends ApiService {
  private _route = '/user-settings' as const

  /**
   * useStore reference
   */
  private _useStoreRef: ReturnType<typeof installUserSettingsStore>

  /**
   * actual Store reference
   */
  private _store: ReturnType<typeof this._useStoreRef>

  /**
   * Store getter
   */
  public Store(): ReturnType<typeof this._useStoreRef> {
    return this._store
  }

  /**
   * constructor
   */
  public constructor(context: Context) {
    super(context)

    this._useStoreRef = installUserSettingsStore()
    this._store = this._useStoreRef()
  }

  /**
   * Gets user settings
   */
  private async getUserSettings(options?: ServiceOptions) {
    return this.httpGet<UserSettings>(
      this._route,
      undefined,
      undefined,
      options
    )
  }

  /**
   * Updates user settings
   */
  private async updateUserSettings(
    settings: UserSettings,
    options?: ServiceOptions
  ) {
    return this.httpPatch<UserSettings>(
      this._route,
      settings,
      undefined,
      options
    )
  }

  /**
   * Reloads user settings from the server
   */
  public async reload() {
    const response = await this.getUserSettings()

    this._store.userSettings = response?.data || undefined
  }

  /**
   * Updates user settings
   */
  public async update(settings: UserSettings) {
    const response = await this.updateUserSettings(settings)

    this._store.userSettings = response?.data || undefined
  }
}
