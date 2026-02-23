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

    const actionsContainer = document.createElement('div') as HTMLElement
    actionsContainer.classList.add('actions')

    const deleteButton = document.createElement('button') as HTMLElement
    deleteButton.innerHTML = '+'
    deleteButton.classList.add('delete-button')
    actionsContainer.appendChild(deleteButton)

    /* const rotateLeftButton = document.createElement('button') as HTMLElement
    rotateLeftButton.innerHTML = '↺'
    rotateLeftButton.classList.add('rotate-left-button')
    actionsContainer.appendChild(rotateLeftButton) */

    /* const rotateRightButton = document.createElement('button') as HTMLElement
    rotateRightButton.innerHTML = '↻'
    rotateRightButton.classList.add('rotate-right-button')
    actionsContainer.appendChild(rotateRightButton) */

    node.appendChild(image)
    node.appendChild(actionsContainer)

    return node
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
