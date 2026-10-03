import { Core } from '@/core/Core'
import Quill from 'quill'
import { CommentBlot, type Comment } from './CommentBlot'
import { Delta } from 'quill/core'
import { type Ref } from 'vue'
import { Range } from 'quill/core/selection'
import type { Parchment } from 'quill'
import { ImageCommentBlot, type ImageComment } from './ImageCommentBlot'
import { ImageOverrideBlot } from './ImageOverrideBlot'
//// @ts-expect-error there are no types for the table module
//import QuillBetterTable from 'quill-better-table'

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
  | 'table-insert-column'
  | 'table-delete-column'
  | 'table-insert-row'
  | 'table-delete-row'
  | 'color'
  | 'formula'

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
  private readonly ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg'] as const
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024

  constructor(
    selector: Ref,
    content: any,
    mode: 'commentable' | 'readonly' | 'full',
    toolbar?: Toolbar
  ) {
    super(selector.value, {
      readOnly: mode === 'readonly',
      debug: false,
      modules: {
        table: true
        /* 'better-table': {
          operationMenu: {
            items: {
              unmergeCells: {
                text: 'Another unmerge cells name'
              }
            },

            color: {
              colors: [
                'red',
                'green',
                'yellow',
                'white',
                'red',
                'green',
                'yellow',
                'white'
              ]
            }
          }
        } */
      }
    })

    this.registerBlots()
    this.initUploader()

    this.toolbar = toolbar

    this.setContents(new Delta(content))
    this.initHandlers()
    this.rerenderToolbar()

    if (mode === 'commentable') {
      this.root.contentEditable = 'false'
    }
  }

  private registerBlots() {
    if (Quill.imports['formats/image'] !== ImageOverrideBlot) {
      Quill.register(ImageOverrideBlot, true)
    }

    if (!Quill.imports['formats/comment']) {
      Quill.register(CommentBlot)
    }

    if (!Quill.imports['formats/image-comment']) {
      Quill.register(ImageCommentBlot)
    }

    //Quill.register({ 'modules/better-table': QuillBetterTable }, true)
  }

  private initHandlers() {
    this.on('selection-change', this.onSelectionChange.bind(this))
  }

  private initUploader() {
    const uploader = this.getModule('uploader') as any

    uploader.options.handler = async (range: Range, files: File[]) => {
      const urls = await Promise.all(files.map((file) => this.uploadFile(file)))
      urls.forEach((url, i) => {
        this.insertImg(range.index + i, url)
      })
    }
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
        this.format('script', currentFormat[type] === value ? false : value)
        break
      case 'align':
        this.format('align', value)
        break
      case 'list':
        this.format('list', currentFormat[type] === value ? false : value)
        break
      case 'header':
        this.format('header', value)
        break
      case 'table':
        ;(this.getModule('table') as any).insertTable(3, 3)
        //await (this.getModule('better-table') as any).insertTable(3, 3)
        break
      case 'table-insert-column':
        ;(this.getModule('table') as any).insertColumnRight()
        //this.format('insertColumnRight', undefined)
        break
      case 'table-delete-column':
        ;(this.getModule('table') as any).deleteColumn()
        break
      case 'table-insert-row':
        ;(this.getModule('table') as any).insertRowBelow()
        //this.format('insertRowDown', undefined)
        break
      case 'table-delete-row':
        ;(this.getModule('table') as any).deleteRow()
        break
      case 'link':
      case 'video':
        await action?.call(this, index)
        break
      case 'image':
        this.insertImg(index, await this.promptAndUploadFile())
        break
      case 'color':
        this.format('color', currentFormat[type] === value ? false : value)
        break
      case 'formula':
        await action?.call(this, index)
        break
    }

    this.rerenderToolbar()
  }

  private async promptAndUploadFile() {
    const file = await this.promptFile()
    if (!file) return

    return await this.uploadFile(file)
  }

  /**
   * Resolves the blot behind a DOM node of this editor (bubbling up to the
   * closest blot if the node itself is not one).
   */
  public findBlot(node: Node | null): Parchment.Blot | null {
    if (!node) return null

    return this.scroll.find(node, true)
  }

  /**
   * Returns the document range occupied by the blot behind a DOM node
   */
  public getBlotRange(node: Node | null): Range | null {
    const blot = this.findBlot(node)

    if (!blot || blot === this.scroll) return null

    return new Range(this.getIndex(blot), blot.length())
  }

  /**
   * Returns the full range of a text comment starting from one of its spans.
   *
   * One logical comment can be rendered as several adjacent `.ql-comment`
   * spans (e.g. when it spans bold and regular text or several paragraphs),
   * so the range of the clicked span is expanded over all neighbouring
   * segments that carry the same comment.
   */
  public getCommentRange(node: HTMLElement): Range | null {
    const blotRange = this.getBlotRange(node)

    if (!blotRange) return null

    const target = CommentBlot.formats(node)

    return this.expandRange(blotRange, (attributes) =>
      isSameComment(attributes?.comment as Comment | undefined, target)
    )
  }

  /**
   * Returns the range of the image comment marker (`*`) behind a DOM node
   */
  public getImageCommentRange(node: HTMLElement): Range | null {
    return this.getBlotRange(node)
  }

  /**
   * Creates a text comment on the range or, if the range already is a
   * comment, replaces its content/type keeping the same range
   */
  public comment(range: Range, comment: Comment) {
    if (!range?.length) return

    this.formatText(range.index, range.length, 'comment', {
      content: comment.content,
      type: comment.type
    })
  }

  public removeComment(range: Range | null) {
    if (!range?.length) return

    this.formatText(range.index, range.length, 'comment', false)
  }

  /**
   * Adds an image comment: inserts a `*` marker right before the image and
   * formats it with the comment data
   */
  public commentImage(comment: ImageComment) {
    const index = this.findImageIndex(comment)

    if (index === null) return

    this.insertText(
      index,
      '*',
      'image-comment',
      toImageCommentValue(comment),
      'api'
    )
  }

  /**
   * Replaces content/type of an existing image comment keeping its
   * marker and position on the image
   */
  public updateImageComment(range: Range | null, comment: ImageComment) {
    if (!range?.length) return

    this.formatText(
      range.index,
      range.length,
      'image-comment',
      toImageCommentValue(comment)
    )
  }

  public removeImageComment(range: Range | null) {
    if (!range?.length) return

    this.deleteText(range.index, range.length)
  }

  /**
   * Deletes an image together with the image comment markers attached to it
   */
  public deleteImage(imageContainer: HTMLElement) {
    const imageBlot = this.findBlot(imageContainer)

    if (!imageBlot || imageBlot === this.scroll) return

    let first: Parchment.Blot = imageBlot

    while (first.prev instanceof ImageCommentBlot) {
      first = first.prev
    }

    const index = this.getIndex(first)
    const length = this.getIndex(imageBlot) + imageBlot.length() - index

    this.deleteText(index, length)
  }

  /**
   * Finds the document index of the image an image comment belongs to.
   * Prefers the actual DOM element the selection was drawn on and falls
   * back to searching by src
   */
  private findImageIndex(comment: ImageComment): number | null {
    if (comment.image) {
      const blot = this.findBlot(comment.image)

      if (blot && blot instanceof ImageOverrideBlot) {
        return this.getIndex(blot)
      }
    }

    if (!comment.imageSrc) return null

    let index = 0

    for (const op of this.getContents().ops) {
      if (
        op.insert &&
        typeof op.insert === 'object' &&
        (op.insert as any).image === comment.imageSrc
      ) {
        return index
      }

      index += typeof op.insert === 'string' ? op.insert.length : 1
    }

    return null
  }

  /**
   * Expands a range over neighbouring delta segments matching the predicate.
   * Newline-only segments are bridged when the segment after them matches,
   * so comments spanning several paragraphs are treated as one
   */
  private expandRange(
    range: Range,
    matches: (attributes: Record<string, unknown> | undefined) => boolean
  ): Range {
    const segments: {
      start: number
      end: number
      isNewline: boolean
      attributes?: Record<string, unknown>
    }[] = []

    let position = 0

    for (const op of this.getContents().ops) {
      const length = typeof op.insert === 'string' ? op.insert.length : 1

      segments.push({
        start: position,
        end: position + length,
        isNewline: typeof op.insert === 'string' && /^\n+$/.test(op.insert),
        attributes: op.attributes as Record<string, unknown> | undefined
      })

      position += length
    }

    const rangeEnd = range.index + range.length

    let startIdx = segments.findIndex(
      (s) => s.start <= range.index && range.index < s.end
    )
    let endIdx = segments.findIndex(
      (s) => s.start < rangeEnd && rangeEnd <= s.end
    )

    if (startIdx === -1 || endIdx === -1) return range

    while (startIdx > 0) {
      const prev = segments[startIdx - 1]

      if (matches(prev.attributes)) {
        startIdx--
      } else if (
        prev.isNewline &&
        startIdx - 2 >= 0 &&
        matches(segments[startIdx - 2].attributes)
      ) {
        startIdx -= 2
      } else {
        break
      }
    }

    while (endIdx < segments.length - 1) {
      const next = segments[endIdx + 1]

      if (matches(next.attributes)) {
        endIdx++
      } else if (
        next.isNewline &&
        endIdx + 2 <= segments.length - 1 &&
        matches(segments[endIdx + 2].attributes)
      ) {
        endIdx += 2
      } else {
        break
      }
    }

    return new Range(
      segments[startIdx].start,
      segments[endIdx].end - segments[startIdx].start
    )
  }

  public async promptFile(): Promise<File | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input')

      input.type = 'file'
      input.multiple = false
      input.accept = this.ALLOWED_MIME_TYPES.join(',')

      // to resolve a bug on iOS
      input.value = ''

      // iOS/macOS Safari can drop the `change` event when the input is
      // detached from the DOM. Mount it off-screen so the event fires reliably.
      input.style.position = 'fixed'
      input.style.top = '-1000px'
      input.style.left = '-1000px'
      input.style.opacity = '0'
      input.style.pointerEvents = 'none'
      input.tabIndex = -1
      input.setAttribute('aria-hidden', 'true')

      let settled = false

      const cleanup = () => {
        if (input.parentNode) {
          input.parentNode.removeChild(input)
        }
      }

      const settle = (file: File | null) => {
        if (settled) return
        settled = true
        cleanup()
        resolve(file)
      }

      input.addEventListener('change', () => {
        settle(input.files?.[0] || null)
      })

      // Some browsers (notably iOS Safari) don't fire `change` when the file
      // dialog is cancelled. Use a one-shot focus listener as a fallback so
      // the promise still resolves and the element is removed from the DOM.
      // Delay the check to give `change` a chance to fire first.
      const onFocus = () => {
        setTimeout(() => {
          if (settled) return
          if (!input.files || input.files.length === 0) {
            settle(null)
          }
        }, 1000)
      }
      window.addEventListener('focus', onFocus, { once: true })

      document.body.appendChild(input)
      input.click()
    })
  }

  private async uploadFile(file: File) {
    try {
      if (file.size > this.MAX_FILE_SIZE) {
        throw new Error(
          `Файл слишком большой, максимальный размер файла ${Math.floor(
            this.MAX_FILE_SIZE / 1024 / 1024
          )} МБ`
        )
      }

      if (!this.ALLOWED_MIME_TYPES.includes(file.type as any)) {
        throw new Error(
          'Недопустимый формат файла. Допустимые форматы: ' +
            this.ALLOWED_MIME_TYPES.map((type) => type.split('/'[1])).join(', ')
        )
      }

      const { data: mediaFiles } = await Core.Services.Media.upload(
        [file],
        undefined,
        {
          showLoader: true
        }
      )

      if (!mediaFiles) {
        throw new Error('Не удалось загрузить файл')
      }

      if (mediaFiles.length === 0) {
        throw new Error('Не удалось загрузить файл')
      }

      return Core.Constants.MEDIA_URL + '/' + mediaFiles[0].src
    } catch (e: any) {
      Core.Services.UI.openErrorModal('Ошибка загрузки файла', e.message)
    }
  }

  private onSelectionChange() {
    if (this.hasFocus()) {
      this.rerenderToolbar()
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

function isSameComment(a?: Comment, b?: Comment): boolean {
  return !!a && !!b && a.content === b.content && a.type === b.type
}

/**
 * Strips runtime-only fields (DOM element, popup state, ...) so that only
 * the persisted image comment shape ends up in the delta
 */
function toImageCommentValue(comment: ImageComment): ImageComment {
  return {
    content: comment.content,
    type: comment.type,
    x: comment.x,
    y: comment.y,
    width: comment.width,
    height: comment.height,
    imageSrc: comment.imageSrc || '',
    imageSize: {
      width: comment.imageSize.width,
      height: comment.imageSize.height
    }
  }
}
