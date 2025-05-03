import { describe, it, expect, vi } from 'vitest'
import { NotificationService } from './notification.service'
import { Api, type ApiResponse } from '../api.utils'
import type { NotificationEntity } from './notification.types'

vi.mock('../api.utils', () => ({
  Api: {
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}))

describe('NotificationService', () => {
  describe('getUnread', () => {
    it('should fetch unread notifications', async () => {
      const mockResponse: ApiResponse<NotificationEntity[]> = {
        data: [
          {
            id: '1',
            message: 'Test notification',
            isRead: false,
            icon: '',
            type: 'info',
            actions: [],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      }
      vi.mocked(Api.get).mockResolvedValue(mockResponse)

      const result = await NotificationService.getUnread()

      expect(Api.get).toHaveBeenCalledWith('/notification?isRead=0')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getRead', () => {
    it('should fetch read notifications', async () => {
      const mockResponse: ApiResponse<NotificationEntity[]> = {
        data: [
          {
            id: '2',
            message: 'Test read notification',
            isRead: true,
            icon: '',
            type: 'info',
            actions: [],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      }
      vi.mocked(Api.get).mockResolvedValue(mockResponse)

      const result = await NotificationService.getRead()

      expect(Api.get).toHaveBeenCalledWith('/notification?isRead=1')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      await NotificationService.markAllAsRead()

      expect(Api.patch).toHaveBeenCalledWith('/notification/mark-all-as-read')
    })
  })

  describe('deleteNotification', () => {
    it('should delete a notification by ID', async () => {
      const notificationId = '123'

      await NotificationService.deleteNotification(notificationId)

      expect(Api.delete).toHaveBeenCalledWith(`/notification/${notificationId}`)
    })
  })
})
