import Embed from 'quill/blots/embed'

export class ImageOverrideBlot extends Embed {
  static blotName = 'image'
  static tagName = 'div'
  static className = 'ql-image'

  static create(value: string) {
    const node = super.create('div') as HTMLElement
    node.classList.add(this.className)

    const image = document.createElement('img') as HTMLElement
    image.setAttribute('src', value)

    node.appendChild(image)
    return node
  }

  static formats(domNode: HTMLElement) {
    return {}
  }

  static register() {
    if (/Firefox/i.test(navigator.userAgent)) {
      setTimeout(() => {
        // Disable image resizing in Firefox
        // @ts-expect-error
        document.execCommand('enableObjectResizing', false, false)
      }, 1)
    }
  }

  static value(domNode: Element) {
    const val = domNode.querySelector('img')?.getAttribute('src')
    return val
  }
}
