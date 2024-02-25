import type { Context } from '@/core/context/Context'
import { StoreService } from '../StoreService'
import { installUIStore } from './UIStore'
import type { StoreDefinition } from 'pinia'

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
    const role = this._context.User!.role

    return this._store.navEntries.filter((entry) => entry.for.includes(role))
  }

  /**
   * Open error modal
   */
  public openErrorModal(title: string, message?: string) {
    this._store.globalModal.type = 'error'
    this._store.globalModal.title = title
    this._store.globalModal.message = message
    this._store.globalModal.isOpen = true
  }

  /**
   * Open warning modal
   */
  public openWarningModal(title: string, message?: string) {
    this._store.globalModal.type = 'warning'
    this._store.globalModal.title = title
    this._store.globalModal.message = message
    this._store.globalModal.isOpen = true
  }

  /**
   * Open info modal
   */
  public openInfoModal(title: string, message?: string) {
    this._store.globalModal.type = 'info'
    this._store.globalModal.title = title
    this._store.globalModal.message = message
    this._store.globalModal.isOpen = true
  }

  /**
   * Open success modal
   */
  public openSuccessModal(title: string, message?: string) {
    this._store.globalModal.type = 'success'
    this._store.globalModal.title = title
    this._store.globalModal.message = message
    this._store.globalModal.isOpen = true
  }

  /**
   * Close modal
   */
  public closeModal() {
    this._store.globalModal.title = ''
    this._store.globalModal.message = undefined
    this._store.globalModal.isOpen = false
  }
}
