import { Constants } from './constants'
import { Context } from './context/Context'
import type { Service } from './services/Service'
import { ServiceFactory, type ServiceName } from './services/ServiceFactory'

/**
 * App core class as a singletone
 */
class CoreClass {
  /**
   * App main context
   */
  private _context: Context

  /**
   * services container
   */
  private _services: ReturnType<typeof ServiceFactory.getServices>

  /**
   * constructor
   */
  constructor() {
    this._context = new Context()
    this._services = ServiceFactory.getServices(this._context)
  }

  /**
   * get current context
   */
  public get Context() {
    return this._context
  }

  /**
   * services container
   */
  public get Services() {
    return this._services
  }

  /**
   * App config
   */
  public get Constants() {
    return Constants
  }
}

export const Core = new CoreClass()
