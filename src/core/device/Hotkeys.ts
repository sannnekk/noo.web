import { debounce } from '../utils/debounce'

const hotKeyMap = new Map<string, HotKeyDefinition>()

export type HotKeyDefinition = {
  keys: string[]
  description: string
  shortcut: string[]
  handler: (...args: any[]) => void
}

export function registerHotkeys(hotKeys: HotKeyDefinition[]) {
  hotKeys.forEach((hotKey) => {
    const key = hotKey.keys.join('+')
    hotKeyMap.set(key, hotKey)
  })

  // disable default keydown events for registered hotkeys
  const registeredKeyCombinations = hotKeys.map((hotKey) =>
    hotKey.keys.join('+').toLowerCase()
  )

  const disableDefaultBehaviorFunc = disableDefaultBehavior(
    registeredKeyCombinations
  )

  window.addEventListener('keydown', disableDefaultBehaviorFunc)

  const onKeyUp = debounce((event: KeyboardEvent) => {
    const keys = []
    if (event.ctrlKey) keys.push('Ctrl')
    if (event.altKey) keys.push('Alt')
    if (event.shiftKey) keys.push('Shift')
    if (event.metaKey) keys.push('Meta')
    keys.push(event.key)

    const key = keys.join('+')
    const hotKey = hotKeyMap.get(key)
    if (hotKey) {
      event.preventDefault()
      hotKey.handler()
    }
  }, 100)

  window.addEventListener('keyup', onKeyUp)

  return () => {
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('keydown', disableDefaultBehaviorFunc)

    hotKeys.forEach((hotKey) => {
      const key = hotKey.keys.join('+')
      hotKeyMap.delete(key)
    })
  }
}

function disableDefaultBehavior(registeredKeyCombinations: string[]) {
  return (event: KeyboardEvent) => {
    const keys = []
    if (event.ctrlKey) keys.push('Ctrl')
    if (event.altKey) keys.push('Alt')
    if (event.shiftKey) keys.push('Shift')
    if (event.metaKey) keys.push('Meta')

    keys.push(event.key)

    const key = keys.join('+').toLowerCase()

    if (registeredKeyCombinations.includes(key)) {
      event.preventDefault()
    }
  }
}

export function getRegisteredHotkeys() {
  return Array.from(hotKeyMap.values())
}
