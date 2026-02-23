export function deepCopy(obj: any, optimized: boolean = true): any {
  if (
    optimized &&
    window.structuredClone &&
    typeof window.structuredClone === 'function'
  ) {
    return window.structuredClone(obj || {})
  }

  return JSON.parse(JSON.stringify(obj || {}))
}
