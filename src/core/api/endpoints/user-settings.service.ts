import { type ApiResponse, Api } from '../api.utils'
import type { UserSettings } from './user-settings.types'

interface UserSettingsService {
  getSettings: () => Promise<ApiResponse<UserSettings>>
  updateSettings: (settings: Partial<UserSettings>) => Promise<ApiResponse>
}

async function getSettings(): Promise<ApiResponse<UserSettings>> {
  return await Api.get('/user-settings')
}

async function updateSettings(
  settings: Partial<UserSettings>
): Promise<ApiResponse> {
  return await Api.patch('/user-settings', settings)
}

export const UserSettingsService: UserSettingsService = {
  getSettings,
  updateSettings
}
