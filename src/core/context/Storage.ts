import Cookie from 'js-cookie'

/**
 * Cookie storage wrapper
 */
export class Storage {
  /**
   * Aliases of storage
   */
  private static _aliases = {
    user: 'noo.context.user',
    apiToken: 'noo.context.apiToken',
    theme: 'noo.context.theme'
  }

  /**
   * Sets storage key
   */
  private static set(key: string, value: any) {
    Cookie.set(key, JSON.stringify(value), { expires: 365 })
  }

  /**
   * Gets storage value
   */
  private static get(key: string) {
    const value = Cookie.get(key)
    return value !== undefined ? JSON.parse(value) : null
  }

  /**
   * Gets user from storage
   */
  public static get User() {
    return this.get(this._aliases.user)
  }

  /**
   * Sets user to storage
   */
  public static set User(value: any) {
    this.set(this._aliases.user, value)
  }

  /**
   * Gets api token from storage
   */
  public static get ApiToken() {
    return this.get(this._aliases.apiToken)
  }

  /**
   * Sets api token to storage
   */
  public static set ApiToken(value: any) {
    this.set(this._aliases.apiToken, value)
  }

  /**
   * Gets theme from storage
   */
  public static get Theme() {
    return this.get(this._aliases.theme) as 'light' | 'dark'
  }

  /**
   * Sets theme to storage
   */
  public static set Theme(value: 'light' | 'dark') {
    this.set(this._aliases.theme, value)
  }

  /**
   * Clears the storage (only known keys)
   */
  public static clear() {
    for (const key in this._aliases) {
      Cookie.remove(this._aliases[key as keyof typeof this._aliases])
    }
  }
}
