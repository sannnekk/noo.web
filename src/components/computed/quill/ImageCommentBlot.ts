import Inline from 'quill/blots/inline'

export interface ImageComment {
  content: string
  type: 'fact-error' | 'logic-error'
  // all the positions are relative to the image, from 0 to 1
  x: number
  y: number
  width: number
  height: number
  imageSrc: string
  image?: HTMLImageElement
  imageSize: {
    width: number
    height: number
  }
}

export class ImageCommentBlot extends Inline {
  static blotName = 'image-comment'
  static tagName = 'span'
  static className = 'ql-image-comment'

  static create(comment: ImageComment) {
    const node = super.create(comment.content)

    node.dataset.comment = comment.content
    node.dataset.type = comment.type
    node.dataset.x = comment.x.toString()
    node.dataset.y = comment.y.toString()
    node.dataset.width = comment.width.toString()
    node.dataset.height = comment.height.toString()
    node.dataset.imageWidth = comment.imageSize.width.toString()
    node.dataset.imageHeight = comment.imageSize.height.toString()

    node.classList.add(this.className)

    return node
  }

  static formats(node: HTMLElement): ImageComment {
    return {
      content: node.dataset.comment!,
      type: node.dataset.type as ImageComment['type'],
      x: parseFloat(node.dataset.x!),
      y: parseFloat(node.dataset.y!),
      width: parseFloat(node.dataset.width!),
      height: parseFloat(node.dataset.height!),
      imageSrc: node.dataset.imageSrc || '',
      imageSize: {
        width: parseFloat(node.dataset.imageWidth!),
        height: parseFloat(node.dataset.imageHeight!)
      }
    }
  }

  static value(node: HTMLElement): string {
    return JSON.stringify(this.formats(node))
  }
}
