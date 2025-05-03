import { type ApiResponse, Api } from '../api.utils'
import type { NotificationEntity } from './notification.types'

interface NotificationService {
  getUnread: () => Promise<ApiResponse<NotificationEntity[]>>
  getRead: () => Promise<ApiResponse<NotificationEntity[]>>
  markAllAsRead: () => Promise<ApiResponse>
  deleteNotification: (notificationId: string) => Promise<ApiResponse>
}

async function getUnread(): Promise<ApiResponse<NotificationEntity[]>> {
  return await Api.get('/notification?isRead=0')
}

async function getRead(): Promise<ApiResponse<NotificationEntity[]>> {
  return await Api.get('/notification?isRead=1')
}

async function markAllAsRead(): Promise<ApiResponse> {
  return await Api.patch('/notification/mark-all-as-read')
}

async function deleteNotification(
  notificationId: string
): Promise<ApiResponse> {
  return await Api.delete(`/notification/${notificationId}`)
}

export const NotificationService: NotificationService = {
  getUnread,
  getRead,
  markAllAsRead,
  deleteNotification
}
