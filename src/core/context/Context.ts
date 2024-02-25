import type { User } from '@/core/data/entities/User'
import { Storage } from './Storage'
import { EventEmitter } from './EventEmitter'

/**
 * App context that holds the current user and other global data
 */
export class Context {
  /**
   * current user
   */
  private _user: User | null = null

  /**
   * current api token
   */
  private _apiToken: string | null = null

  /**
   * event emitter
   */
  private _eventEmitter = new EventEmitter()

  /**
   * constructor
   */
  public constructor(user?: User | undefined, apiToken?: string | undefined) {
    this._user = user || Storage.User
    this._apiToken = apiToken || Storage.ApiToken
  }

  /**
   * get current User
   */
  public get User() {
    return Object.freeze(this._user)
  }

  /**
   * get current api token
   */
  public get ApiToken() {
    return this._apiToken
  }

  /**
   * set current user
   */
  public get Events() {
    return this._eventEmitter
  }

  /**
   * set current user
   */
  public set User(user: User | null) {
    this._user = user
    Storage.User = user
  }

  /**
   * set current api token
   */
  public set ApiToken(token: string | null) {
    this._apiToken = token
    Storage.ApiToken = token
  }

  /**
   * clear the context
   */
  public clear() {
    this._user = null
    this._apiToken = null

    Storage.clear()
  }
}
