export function deepCopy(obj: any): any {
  if (window.structuredClone && typeof window.structuredClone === 'function') {
    return window.structuredClone(obj || {})
  }

  return JSON.parse(JSON.stringify(obj || {}))
}
