import Cookie from 'js-cookie'

const StorageAliases = {
  user: 'noo.userInfo',
  apiToken: 'noo.apiToken',
  theme: 'noo.theme'
} as const

function set<T>(key: string, value: T): void {
  Cookie.set(key, JSON.stringify(value), { expires: 365 })
}

function get<T>(key: string): T | undefined {
  const value = Cookie.get(key)
  return value !== undefined ? JSON.parse(value) : undefined
}

function isSet(key: string): boolean {
  return Cookie.get(key) !== undefined
}

function clear() {
  for (const key in StorageAliases) {
    Cookie.remove(StorageAliases[key as keyof typeof StorageAliases])
  }
}

export const CookieStorage = { get, set, isSet, clear, StorageAliases }
