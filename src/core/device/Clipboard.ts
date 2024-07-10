export function copyText(text: string): void {
  navigator.clipboard.writeText(text)
}

export function pasteText(): Promise<string> {
  return navigator.clipboard.readText()
}
