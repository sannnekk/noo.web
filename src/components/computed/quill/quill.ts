import { Core } from '@/core/Core'
import Quill from 'quill'
import { CommentBlot, type Comment } from './CommentBlot'
import { Delta } from 'quill/core'
import { type Ref } from 'vue'
import { Range } from 'quill/core/selection'
import { ImageCommentBlot, type ImageComment } from './ImageCommentBlot'
import { ImageOverrideBlot } from './ImageOverrideBlot'

export type FormatType =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'script'
  | 'link'
  | 'image'
  | 'video'
  | 'align'
  | 'header'
  | 'list'
  | 'table'

export type Toolbar = {
  type: FormatType
  value: string | number | boolean
  title: string
  icon: string
  active: boolean
  action?: (index: number) => void | Promise<void>
}[][]

export function registerModules(modules: Record<string, any>) {
  for (const key in modules) {
    Quill.register(`modules/${key}`, modules[key], false)
  }
}

export class CustomQuill extends Quill {
  private toolbar?: Toolbar
  private readonly ALLOWED_MIME_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg'
  ] as const
  private readonly MAX_FILE_SIZE = 3 * 1024 * 1024

  constructor(
    selector: Ref,
    content: any,
    mode: 'commentable' | 'readonly' | 'full',
    toolbar?: Toolbar
  ) {
    super(selector.value, {
      readOnly: mode === 'readonly'
    })

    this.registerBlots()

    this.toolbar = toolbar

    this.setContents(new Delta(content))
    this.initHandlers()
    this.rerenderToolbar()

    if (mode === 'commentable') {
      this.root.contentEditable = 'false'
    }
  }

  private registerBlots() {
    Quill.register(CommentBlot)
    Quill.register(ImageCommentBlot)
    Quill.register(ImageOverrideBlot)
  }

  private initHandlers() {
    this.on('selection-change', this.onSelectionChange.bind(this))
    this.container.addEventListener('drop', this.onDrop.bind(this))
    this.container.addEventListener('paste', this.onPaste.bind(this))
  }

  public rerenderToolbar() {
    if (!this.toolbar) return

    for (const group of this.toolbar) {
      for (const item of group) {
        if (item.value === undefined) continue
        item.active = this.getFormat()[item.type] === item.value
      }
    }
  }

  public async toggleFormat(
    type: FormatType,
    value: string | number | boolean,
    action?: (index: number) => void | Promise<void>
  ) {
    const selection = this.getSelection()
    const index = selection?.index || 0
    const currentFormat = this.getFormat()

    switch (type) {
      case 'bold':
      case 'italic':
      case 'underline':
      case 'strike':
        this.format(type, !currentFormat[type])
        break
      case 'script':
        const script = currentFormat[type]
        this.format('script', script === value ? false : value)
        break
      case 'align':
        this.format('align', value)
        break
      case 'list':
        const list = currentFormat[type]
        this.format('list', list === value ? false : value)
        break
      case 'header':
        this.format('header', value)
        break
      case 'table':
        // TODO: table
        break
      case 'link':
      case 'video':
        await action?.call(this, index)
        break
      case 'image':
        const file = await this.promptFile()
        if (!file) return

        const url = await this.uploadFile(file)
        this.insertImg(index, url)
        break
    }

    this.rerenderToolbar()
  }

  public comment(range: Range, comment: Comment) {
    this.focus()
    this.setSelection(range.index, range.length)
    this.format('comment', comment)
    this.setSelection(0, 0, 'silent')
  }

  public commentImage(comment: ImageComment) {
    const contents = this.getContents()

    // find the image index
    const currentOpIndex = contents.ops.findIndex((op) => {
      return (
        op.insert &&
        (op.insert as any).image &&
        (op.insert as any).image === comment.imageSrc
      )
    })

    const index =
      contents.ops.reduce((acc, op, i) => {
        if (i > currentOpIndex) return acc
        if (op.insert && typeof op.insert === 'string') {
          return acc + op.insert.length
        }
        return acc + 1
      }, 0) - 1

    if ('originPosition' in comment) {
      comment.x = (comment.originPosition as any).x
      comment.y = (comment.originPosition as any).y
    }

    // add the comment
    if (index !== -1) {
      this.focus()
      this.setSelection(index, 0, 'silent')
      this.insertText(index, '*', 'silent')
      this.setSelection(index, 1, 'silent')
      this.format('image-comment', comment, 'silent')
      this.setSelection(0, 0, 'silent')
    }
  }

  public removeComment(comment: Comment & { range: Range | null }) {
    if (!comment.range) return

    this.focus()
    this.setSelection(comment.range.index, comment.range.length, 'silent')
    this.format('comment', false, 'silent')
    this.setSelection(0, 0, 'silent')
  }

  public removeImageComment(comment: ImageComment) {
    const contents = this.getContents()

    // find the image index
    const currentOpIndex = contents.ops.findIndex((op) => {
      return (
        typeof op.insert === 'string' &&
        op.attributes &&
        (op.attributes['image-comment'] as any)?.content === comment.content &&
        (op.attributes['image-comment'] as any)?.type === comment.type &&
        (op.attributes['image-comment'] as any)?.x === comment.x &&
        (op.attributes['image-comment'] as any)?.y === comment.y
      )
    })

    let index = contents.ops.reduce((acc, op, i) => {
      if (i > currentOpIndex) return acc
      if (op.insert && typeof op.insert === 'string') {
        return acc + op.insert.length
      }
      return acc + 1
    }, 0)

    if (currentOpIndex !== -1) {
      this.focus()

      if (this.getContents(index, 1).ops[0].insert !== '*') {
        index = index - 1
      }

      this.setSelection(index, 1, 'silent')
      this.format('image-comment', false, 'silent')
      this.deleteText(index, 1, 'silent')
      this.setSelection(0, 0, 'silent')
    }
  }

  public async promptFile(): Promise<File | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.multiple = false
      input.accept = this.ALLOWED_MIME_TYPES.join(', ')
      input.hidden = true
      input.onchange = () => {
        const file = input.files?.[0] || null
        resolve(file)
      }
      input.click()
    })
  }

  private async uploadFile(file: File) {
    Core.Services.UI.setLoading(true)

    try {
      if (file.size > this.MAX_FILE_SIZE) {
        throw new Error('Файл слишком большой, максимальный размер файла 3 МБ')
      }

      if (!this.ALLOWED_MIME_TYPES.includes(file.type as any)) {
        throw new Error(
          'Недопустимый формат файла. Допустимые форматы: ' +
            this.ALLOWED_MIME_TYPES.map((type) => type.split('/'[1])).join(', ')
        )
      }

      const { data: mediaFiles } = await Core.Services.Media.upload([file])

      if (!mediaFiles) {
        throw new Error('Не удалось загрузить файл')
      }

      if (mediaFiles.length === 0) {
        throw new Error('Не удалось загрузить файл')
      }

      return Core.Constants.MEDIA_URL + '/' + mediaFiles[0].link
    } catch (e: any) {
      Core.Services.UI.openErrorModal('Ошибка загрузки файла', e.message)
    } finally {
      Core.Services.UI.setLoading(false)
    }
  }

  private onSelectionChange() {
    if (this.hasFocus()) {
      this.rerenderToolbar()
    }
  }

  private onDrop(event: DragEvent) {
    const files = event.dataTransfer?.files
    const index = this.getSelection()?.index || 0

    if (!files || !files.length) return

    event.stopPropagation()
    event.preventDefault()

    setTimeout(async () => {
      for (const file of Array.from(files)) {
        if (!this.ALLOWED_MIME_TYPES.includes(file.type as any)) {
          continue
        }

        if (file.size > this.MAX_FILE_SIZE) {
          continue
        }

        const url = await this.uploadFile(file)
        this.insertImgAndRemoveDataUrl(index, url)
      }
    }, 0)
  }

  private onPaste(event: ClipboardEvent) {
    const index = this.getSelection()?.index || 0
    const clipboard = event.clipboardData || (window as any).clipboardData

    // IE 11 is .files other browsers are .items
    if (!clipboard && !(clipboard.items || clipboard.files)) {
      return
    }

    const items = clipboard.items || clipboard.files

    for (const item of items) {
      if (!this.ALLOWED_MIME_TYPES.includes(item.type)) {
        return
      }

      const file = item.getAsFile ? item.getAsFile() : item

      if (!file) {
        return
      }

      this.focus()
      event.preventDefault()

      setTimeout(async () => {
        this.focus()
        const url = await this.uploadFile(file)

        this.insertImgAndRemoveDataUrl(index || 0, url)
      }, 0)
    }
  }

  private insertImgAndRemoveDataUrl(index: number, url?: string) {
    if (url) {
      setTimeout(() => {
        this.focus()
        this.deleteText(index, 1)
        this.insertEmbed(index, 'image', url, 'user')
      }, 0)
    }
  }

  private insertImg(index: number, url?: string) {
    if (url) {
      setTimeout(() => {
        this.focus()
        this.insertEmbed(index, 'image', url, 'user')
      }, 0)
    }
  }
}
