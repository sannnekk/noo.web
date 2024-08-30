import type { Context } from '@/core/context/Context'
import type { Pagination } from '@/core/data/Pagination'
import type { Notification } from '@/core/data/entities/Notification'
import { ApiService, type ServiceOptions } from '@/core/services/ApiService'
import { installNotificationStore } from './NotificationStore'

export type NotificationSendOptions = {
  selector: 'role' | 'course' | 'all'
  value: null | string // role name or course id
}

/**
 * Notification service
 */
export class NotificationService extends ApiService {
  private _route = '/notification' as const

  /**
   * Ticker threshold (in ms)
   */
  private tickerThreshold = 60 * 1000

  /**
   * useStore reference
   */
  private _useStoreRef: ReturnType<typeof installNotificationStore>

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
   * Ticker reference
   */
  private _tickerRef: ReturnType<typeof setInterval> | undefined

  /**
   * Some users can send notifications to other users
   */
  public async createNotification(
    notification: Notification,
    sendOptions: NotificationSendOptions,
    ServiceOptions: ServiceOptions = {}
  ) {
    await this.httpPost<Notification>(
      this._route,
      {
        notification,
        sendOptions
      },
      undefined,
      ServiceOptions
    )
  }

  /**
   * constructor
   */
  public constructor(context: Context) {
    super(context)

    this._useStoreRef = installNotificationStore()
    this._store = this._useStoreRef()

    this.initTicker()
  }

  /**
   * Init ticker to check for new notifications every *threshold* ms
   */
  private initTicker() {
    if (this._context.isLoggedIn()) {
      this.updateState()

      this._tickerRef = setInterval(
        this.updateState.bind(this),
        this.tickerThreshold
      )
    }
  }

  /**
   * Get latest notification state
   */
  private async updateState() {
    try {
      const newNotifications = await this.getUnreadNotifications()
      await this.getUnreadCount()
      await this.getReadNotifications()

      this._store.showOneByOne(newNotifications.data)
    } catch (error) {
      //
    }
  }

  /**
   * Set pane open
   */
  setPaneOpen(value: boolean) {
    this._store.isPaneOpen = value
    this._store.unreadCount = 0

    try {
      if (value === false) {
        const thisRef = this
        setTimeout(() => {
          thisRef.markAllAsRead().then(() => thisRef.updateState())
        }, 300)
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Mark all notifications as read
   */
  private async markAllAsRead() {
    await this.httpPatch(`${this._route}/mark-all-as-read`)
  }

  /**
   * Get unread notifications
   */
  private async getUnreadNotifications() {
    return this.httpGet<Notification[]>(`${this._route}/unread`)
  }

  /**
   * Get notifications
   */
  private async getReadNotifications(
    pagination?: Pagination,
    options: ServiceOptions = {}
  ) {
    const response = await this.httpGet<Notification[]>(
      `${this._route}/read`,
      pagination,
      undefined,
      options
    )

    this._store.notifications = response.data
  }

  /**
   * Get unread notifications count
   */
  private async getUnreadCount(options: ServiceOptions = {}) {
    const response = await this.httpGet<number>(
      `${this._route}/unread-count`,
      undefined,
      undefined,
      options
    )

    this._store.unreadCount = response.data || 0
  }

  /**
   * Delete notification
   */
  public async deleteNotification(id: string, options: ServiceOptions = {}) {
    await this.httpDelete(`${this._route}/${id}`, undefined, options)

    this._store.unreadCount = this._store.unreadCount - 1
    this._store.newNotifications = this._store.newNotifications.filter(
      (n) => n.id !== id
    )
    this._store.notifications = this._store.notifications.filter(
      (n) => n.id !== id
    )
  }
}
