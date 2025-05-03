import { describe, it, expect, vi } from 'vitest'
import { UserSettingsService } from './user-settings.service'
import { Api, type ApiResponse } from '../api.utils'
import type { UserSettings } from './user-settings.types'

vi.mock('../api.utils', () => ({
  Api: {
    get: vi.fn(),
    patch: vi.fn()
  }
}))

describe('UserSettingsService', () => {
  describe('getSettings', () => {
    it('should call Api.get with the correct endpoint and return the response', async () => {
      const mockResponse = { data: { theme: 'dark' } }
      vi.mocked(Api.get).mockResolvedValue(mockResponse)

      const response = await UserSettingsService.getSettings()

      expect(Api.get).toHaveBeenCalledWith('/user-settings')
      expect(response).toEqual(mockResponse)
    })
  })

  describe('updateSettings', () => {
    it('should call Api.patch with the correct endpoint and payload and return the response', async () => {
      const mockSettings: UserSettings = {
        theme: 'light',
        fontSize: 'small',
        backgroundImage: null
      }

      await UserSettingsService.updateSettings(mockSettings)

      expect(Api.patch).toHaveBeenCalledWith('/user-settings', mockSettings)
    })
  })
})
