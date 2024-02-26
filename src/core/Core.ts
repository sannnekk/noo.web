import { Constants } from './constants'
import { Context } from './context/Context'
import type { EventName } from './context/EventEmitter'
import { events } from './events'
import { ServiceFactory, type ServiceName } from './services/ServiceFactory'

/**
 * App core class as a singletone
 */
class CoreClass {
  /**
   * Initialized flag
   */
  private _itialized: boolean = false

  /**
   * App main context
   */
  private _context!: Context

  /**
   * services container
   */
  private _services!: ReturnType<typeof ServiceFactory.getServices>

  /**
   * constructor
   */
  constructor() {
    if (this._itialized) {
      throw new Error('Core is a singletone')
    }
  }

  /**
   * Init function. Called once on app mount to initialize the core
   */
  public init() {
    if (!this._itialized) {
      console.log('Core init')

      this._context = new Context()
      this._services = ServiceFactory.getServices(this._context)

      this._subscribeCoreEvents()

      this._itialized = true
      this._context.Events.emit('global:init', this._context)
    }

    return this
  }

  /**
   * Check if core is initialized
   */
  public isInitialized() {
    return this._itialized
  }

  /**
   * get current context
   */
  public get Context() {
    this.throwIfNotInitialized()
    return this._context
  }

  /**
   * services container
   */
  public get Services() {
    this.throwIfNotInitialized()
    return this._services
  }

  /**
   * App config
   */
  public get Constants() {
    this.throwIfNotInitialized()
    return Constants
  }

  /**
   * Throw if core is not initialized
   */
  private throwIfNotInitialized() {
    if (!this._itialized) {
      throw new Error('Core is not initialized')
    }
  }

  /**
   * Add core events
   */
  private _subscribeCoreEvents() {
    this._context.Events.onMany(events)
  }
}

export const Core = new CoreClass()
