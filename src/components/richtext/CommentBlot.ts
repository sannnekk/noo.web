import Inline from 'quill/blots/inline'
import type { ImageComment } from './ImageCommentBlot'

export type Comment = {
  content: string
  type: string
}

export class CommentBlot extends Inline {
  static blotName = 'comment'
  static tagName = 'span'
  static className = 'ql-comment'

  static create(comment: Comment | ImageComment) {
    const node = super.create(comment.content)

    node.dataset.comment = comment.content
    node.dataset.type = comment.type
    node.classList.add(this.className)

    return node
  }

  static formats(node: HTMLElement): Comment | ImageComment {
    return {
      content: node.dataset.comment!,
      type: node.dataset.type as Comment['type'],
      x: node.dataset.x ? parseInt(node.dataset.x) : undefined,
      y: node.dataset.y ? parseInt(node.dataset.y) : undefined,
      width: node.dataset.width ? parseInt(node.dataset.width) : undefined,
      height: node.dataset.height ? parseInt(node.dataset.height) : undefined,
      imageSrc: node.dataset.imageSrc
    }
  }

  static value(node: HTMLElement): Comment | ImageComment {
    return {
      content: node.dataset.comment!,
      type: node.dataset.type as Comment['type'],
      x: node.dataset.x ? parseInt(node.dataset.x) : undefined,
      y: node.dataset.y ? parseInt(node.dataset.y) : undefined,
      width: node.dataset.width ? parseInt(node.dataset.width) : undefined,
      height: node.dataset.height ? parseInt(node.dataset.height) : undefined,
      imageSrc: node.dataset.imageSrc
    }
  }
}
