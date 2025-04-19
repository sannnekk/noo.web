function warn(message: string, ...optionalParams: any[]): void {
  console.warn(message, ...optionalParams)
}

function deprecatedWarn(message: string, ...optionalParams: any[]): void {
  console.warn(`[DEPRECATED]: ${message}`, ...optionalParams)
}

function error(message: string, ...optionalParams: any[]): void {
  console.error(message, ...optionalParams)
}

function info(message: string, ...optionalParams: any[]): void {
  console.info(message, ...optionalParams)
}

export { warn, deprecatedWarn, error, info }
