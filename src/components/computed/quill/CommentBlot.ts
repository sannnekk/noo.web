import Inline from 'quill/blots/inline'

export type Comment = {
  content: string
  type: 'fact-error' | 'logic-error'
}

export class CommentBlot extends Inline {
  static blotName = 'comment'
  static tagName = 'span'
  static className = 'ql-comment'

  static create(comment: Comment) {
    const node = super.create(comment.content)
    node.dataset.comment = comment.content
    node.dataset.type = comment.type
    node.classList.add(this.className)
    return node
  }

  static formats(node: HTMLElement): Comment {
    return {
      content: node.dataset.comment!,
      type: node.dataset.type as Comment['type']
    }
  }

  static value(node: HTMLElement): Comment {
    return {
      content: node.dataset.comment!,
      type: node.dataset.type as Comment['type']
    }
  }
}
