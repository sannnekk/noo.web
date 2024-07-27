import type { Context } from '@/core/context/Context'
import { StoreService } from '../StoreService'
import { installUIStore, type ModalAction } from './UIStore'

/**
 * UI service
 */
export class UIService extends StoreService {
  /**
   * useStore reference
   */
  private _useStoreRef: ReturnType<typeof installUIStore>

  /**
   * actual Store reference
   */
  private _store: ReturnType<typeof this._useStoreRef>

  /**
   * Constructor
   */
  public constructor(context: Context) {
    super(context)

    this._useStoreRef = installUIStore()
    this._store = this._useStoreRef()
  }

  /**
   * Gets store, should not be used directly unless necessary
   */
  public Store() {
    return this._useStoreRef()
  }

  /**
   * Set global app state to loading. This will show a loading spinner overlay
   */
  public setLoading(isLoading: boolean) {
    this._store.isLoading = isLoading

    if (isLoading) {
      this._store.loadingProgress = 0.05
    } else {
      this._store.loadingProgress = 0
    }
  }

  public setLoadingProgress(progress: number) {
    this._store.loadingProgress = progress
  }

  /**
   * Set nav pane open state
   */
  public setPaneOpen(isOpen: boolean) {
    this._store.isPaneOpen = isOpen
  }

  /**
   * Get nav entries for current user
   */
  public getNavEntries() {
    const role = this._context.User?.role

    if (!role) {
      return []
    }

    return this._store.navEntries.filter((entry) => entry.for.includes(role))
  }

  /**
   * Open error modal
   */
  public openErrorModal(
    title: string,
    message?: string,
    actions: ModalAction[] = []
  ) {
    this._store.globalModal.type = 'error'
    this._store.globalModal.title = title
    this._store.globalModal.message = message
    this._store.globalModal.isOpen = true
    this._store.globalModal.actions = actions
  }

  public openRetryLoginModal() {
    this._store.retryLoginModal.isOpen = true
  }

  /**
   * Open warning modal
   */
  public openWarningModal(
    title: string,
    message?: string,
    actions: ModalAction[] = []
  ) {
    this._store.globalModal.type = 'warning'
    this._store.globalModal.title = title
    this._store.globalModal.message = message
    this._store.globalModal.isOpen = true
    this._store.globalModal.actions = actions
  }

  /**
   * Open info modal
   */
  public openInfoModal(
    title: string,
    message?: string,
    actions: ModalAction[] = []
  ) {
    this._store.globalModal.type = 'info'
    this._store.globalModal.title = title
    this._store.globalModal.message = message
    this._store.globalModal.isOpen = true
    this._store.globalModal.actions = actions
  }

  /**
   * Open success modal
   */
  public openSuccessModal(
    title: string,
    message?: string,
    actions: ModalAction[] = []
  ) {
    this._store.globalModal.type = 'success'
    this._store.globalModal.title = title
    this._store.globalModal.message = message
    this._store.globalModal.isOpen = true
    this._store.globalModal.actions = actions
  }

  /**
   * Close modal
   */
  public closeModal() {
    this._store.globalModal.title = ''
    this._store.globalModal.message = undefined
    this._store.globalModal.isOpen = false
    this._store.globalModal.actions = []
  }
}
