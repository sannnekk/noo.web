/**
 * Local Storage wrapper
 */
export class Storage {
  /**
   * Aliases  of storage
   */
  private static _aliases = {
    user: 'noo.context.user',
    apiToken: 'noo.context.apiToken'
  }

  /**
   * Sets storage key
   */
  private static set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  /**
   * Gets storage value
   */
  private static get(key: string) {
    const value = localStorage.getItem(key)
    return value !== null ? JSON.parse(value) : null
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
   * Clears the storage (only known keys)
   */
  public static clear() {
    for (const key in this._aliases) {
      localStorage.removeItem(this._aliases[key as keyof typeof this._aliases])
    }
  }
}
