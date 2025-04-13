import type { ImageComment } from './ImageCommentBlot'
import { CustomQuill } from './quill'

const currentSelection = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  image: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  started: false,
  element: null as HTMLElement | null
}

const selection = {
  element: null as HTMLElement | null
}

export function onMouseDown(e: MouseEvent): void {
  const target = e.target as HTMLElement
  const image = target.closest('img')
  const container = target.closest('.ql-image') as HTMLElement

  if (!image) return

  const rect = image.getBoundingClientRect()

  currentSelection.x = e.clientX - rect.left
  currentSelection.y = e.clientY - rect.top
  currentSelection.width = 0
  currentSelection.height = 0
  currentSelection.element = container
  currentSelection.started = true

  currentSelection.image = {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height
  }

  showSelection()
}

export function onMouseMove(e: MouseEvent): void {
  if (!currentSelection.started) return

  const mouseX = e.clientX - currentSelection.image.x
  const mouseY = e.clientY - currentSelection.image.y

  let width = mouseX - currentSelection.x
  let height = mouseY - currentSelection.y

  if (width + currentSelection.x > currentSelection.image.width) {
    width = Math.abs(currentSelection.image.width - currentSelection.x)
  }

  if (e.clientY > currentSelection.image.y + currentSelection.image.height) {
    height = Math.abs(currentSelection.image.height - currentSelection.y)
  }

  currentSelection.width = width
  currentSelection.height = height

  updateSelection()
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function onMouseUp(e: MouseEvent): ImageComment | null {
  if (!currentSelection.started) {
    return null
  }

  currentSelection.started = false

  const image = currentSelection.element!.querySelector(
    'img'
  ) as HTMLImageElement

  const imageComment: ImageComment = {
    content: '',
    type: 'logic-error',
    x: currentSelection.x,
    y: currentSelection.y,
    imageSize: {
      width: image.offsetWidth,
      height: image.offsetHeight
    },
    width: currentSelection.width,
    height: currentSelection.height,
    imageSrc: image.getAttribute('src')!,
    image: image
  }

  return imageComment
}

export function removeAllSelections(quill: CustomQuill): void {
  const selections = quill.root.querySelectorAll('.ql-image-comment-selection')

  selections.forEach((selection) => {
    selection.remove()
  })
}

export function drawAllSelections(quill: CustomQuill): void {
  const selections = quill.root.querySelectorAll(
    '.ql-image-comment'
  ) as NodeListOf<HTMLElement>

  selections.forEach((selection) => {
    let imageContainer = selection.nextElementSibling as HTMLElement
    const imageComment = {
      content: selection.dataset.comment!,
      type: selection.dataset.type as ImageComment['type'],
      x: parseFloat(selection.dataset.x!),
      y: parseFloat(selection.dataset.y!),
      width: parseFloat(selection.dataset.width!),
      height: parseFloat(selection.dataset.height!),
      imageSrc: selection.dataset.imageSrc || '',
      imageSize: {
        width: parseFloat(selection.dataset.imageWidth!),
        height: parseFloat(selection.dataset.imageHeight!)
      }
    }

    while (imageContainer && !imageContainer.classList.contains('ql-image')) {
      imageContainer = imageContainer.nextElementSibling as HTMLElement
    }

    const selectionElement = document.createElement('div')
    selectionElement.classList.add('ql-image-comment-selection')

    const left = (imageComment.x / imageComment.imageSize.width) * 100
    const top = (imageComment.y / imageComment.imageSize.height) * 100
    const width = (imageComment.width / imageComment.imageSize.width) * 100
    const height = (imageComment.height / imageComment.imageSize.height) * 100

    selectionElement.style.left = left + '%'
    selectionElement.style.top = top + '%'
    selectionElement.style.width = width + '%'
    selectionElement.style.height = height + '%'
    selectionElement.dataset.comment = imageComment.content
    selectionElement.dataset.type = imageComment.type
    selectionElement.dataset.width = imageComment.width.toString()
    selectionElement.dataset.height = imageComment.height.toString()

    if (!imageContainer) {
      return
    }

    imageContainer.appendChild(selectionElement)
  })
}

function showSelection(): void {
  const selectionElement = document.createElement('div')
  selectionElement.classList.add('ql-image-comment-selection')

  selection.element = selectionElement

  currentSelection.element?.appendChild(selectionElement)

  updateSelection()
}

function updateSelection(): void {
  if (!selection.element) return

  const left = (currentSelection.x / currentSelection.image.width) * 100
  const top = (currentSelection.y / currentSelection.image.height) * 100
  const width = (currentSelection.width / currentSelection.image.width) * 100
  const height = (currentSelection.height / currentSelection.image.height) * 100

  selection.element.style.left = left + '%'
  selection.element.style.top = top + '%'
  selection.element.style.width = width + '%'
  selection.element.style.height = height + '%'
}

export function removeSelection(): void {
  if (!selection.element) return

  selection.element.remove()
}
