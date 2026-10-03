import type { Context } from '@/core/context/Context'
import { ApiService, type ServiceOptions } from '@/core/services/ApiService'

const SERVICE_WORKER_URL = '/push-sw.js'

/**
 * Browser push notifications service
 */
export class PushService extends ApiService {
  private _route = '/push-subscription' as const

  /**
   * constructor
   */
  public constructor(context: Context) {
    super(context)
  }

  /**
   * Whether the browser supports push notifications
   */
  public isSupported(): boolean {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    )
  }

  /**
   * iOS supports push only when the site is installed to the home screen
   */
  public needsInstall(): boolean {
    const isIos =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true

    return isIos && !isStandalone
  }

  /**
   * Current notification permission of the browser
   */
  public getPermission(): NotificationPermission {
    return this.isSupported() ? Notification.permission : 'denied'
  }

  /**
   * Get the current push subscription of this browser (if any)
   */
  public async getCurrentSubscription(): Promise<PushSubscription | null> {
    if (!this.isSupported()) {
      return null
    }

    const registration = await navigator.serviceWorker.getRegistration('/')

    if (!registration) {
      return null
    }

    return registration.pushManager.getSubscription()
  }

  /**
   * Ask for permission, subscribe the browser and save the subscription
   */
  public async enable(options: ServiceOptions = {}): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Браузер не поддерживает push-уведомления')
    }

    const permission = await Notification.requestPermission()

    if (permission !== 'granted') {
      throw new Error('Разрешение на уведомления не выдано')
    }

    const publicKey = await this.getPublicKey(options)

    if (!publicKey) {
      throw new Error('Push-уведомления не настроены на сервере')
    }

    const registration = await this.getRegistration()

    let subscription = await registration.pushManager.getSubscription()

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(publicKey)
      })
    }

    await this.subscribe(subscription.toJSON(), options)
  }

  /**
   * Unsubscribe the browser and remove the subscription on the server
   */
  public async disable(options: ServiceOptions = {}): Promise<void> {
    const subscription = await this.getCurrentSubscription()

    if (!subscription) {
      return
    }

    const endpoint = subscription.endpoint

    await subscription.unsubscribe()
    await this.unsubscribe(endpoint, options)
  }

  /**
   * Get the VAPID public key
   */
  public async getPublicKey(
    options: ServiceOptions = {}
  ): Promise<string | null> {
    const response = await this.httpGet<string | null>(
      `${this._route}/public-key`,
      undefined,
      undefined,
      options
    )

    return response.data
  }

  /**
   * Save the subscription on the server
   */
  public async subscribe(
    subscription: PushSubscriptionJSON,
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpPost(
      this._route,
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys
      },
      undefined,
      options
    )
  }

  /**
   * Remove the subscription on the server
   */
  public async unsubscribe(
    endpoint: string,
    options: ServiceOptions = {}
  ): Promise<void> {
    await this.httpPost(
      `${this._route}/unsubscribe`,
      { endpoint },
      undefined,
      options
    )
  }

  private async getRegistration(): Promise<ServiceWorkerRegistration> {
    await navigator.serviceWorker.register(SERVICE_WORKER_URL)

    return navigator.serviceWorker.ready
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    const rawData = window.atob(base64)

    return Uint8Array.from(rawData, (char) => char.charCodeAt(0))
  }
}
