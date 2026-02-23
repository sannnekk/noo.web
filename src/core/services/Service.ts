import type { Context } from '../context/Context'

/**
 * Base service class
 */
export abstract class Service {
  /**
   * App main context
   */
  protected _context: Context

  /**
   * Constructor
   */
  public constructor(context: Context) {
    this._context = context
  }
}
