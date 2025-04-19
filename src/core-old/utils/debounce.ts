export function debounce(func: Function, wait: number = 250) {
  let timeout: NodeJS.Timeout

  return function (...args: any[]) {
    return new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout)
      }

      timeout = setTimeout(() => resolve(func.call(undefined, ...args)), wait)
    })
  }
}
