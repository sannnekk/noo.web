import type { User } from '@/core/data/entities/User'
import { Storage } from './Storage'
import { EventEmitter } from './EventEmitter'
import { useRoute } from 'vue-router'

/**
 * App context that holds the current user and other global data
 */
export class Context {
  /**
   * event emitter
   */
  private _eventEmitter = new EventEmitter()

  /**
   * Route instance
   */
  private _route = useRoute()

  /**
   * constructor
   */
  public constructor(user?: User | undefined, apiToken?: string | undefined) {
    if (user && apiToken) {
      Storage.User = user
      Storage.ApiToken = apiToken
    } else {
      this._eventEmitter.emit('global:logout', this)
    }
  }

  /**
   * get current User
   */
  public get User() {
    return Storage.User
  }

  /**
   * Set context user
   */
  public setUser(value: User) {
    Storage.User = value
  }

  /**
   * get current api token
   */
  public get ApiToken() {
    return Storage.ApiToken
  }

  public get Theme() {
    return Storage.Theme
  }

  public set Theme(theme: 'light' | 'dark') {
    Storage.Theme = theme
  }

  /**
   * check if context is initialized
   */
  public isInitialized() {
    return Storage.User && Storage.ApiToken
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
    Storage.User = user
  }

  /**
   * set current api token
   */
  public set ApiToken(token: string | null) {
    Storage.ApiToken = token
  }

  /**
   * useRoute instance getter
   */
  public get Route() {
    return this._route
  }

  /**
   * check if user is logged in
   */
  public isLoggedIn() {
    return Storage.User !== null
  }

  /**
   * Check user role
   */
  public roleIs(roles: User['role'][]) {
    return roles.includes(Storage.User?.role)
  }

  /**
   * clear the context
   */
  public clear() {
    Storage.clear()
  }
}
