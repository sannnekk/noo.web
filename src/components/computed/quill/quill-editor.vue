<template>
  <div class="quill-editor">
    <quill-toolbar
      :visible="mode === 'full'"
      :toolbar="toolbar"
      :id="id"
      @format="quill?.toggleFormat($event.type, $event.value, $event.action)"
    />
    <quill-prompt
      :label="prompt.label"
      :action="prompt.action"
      v-model:visible="prompt.visible"
    />
    <div
      class="quill-editor__content"
      :class="{
        'quill-editor__content--readonly': readonly,
        'quill-editor__content--allow-image-rotation': allowImageRotation
      }"
      :style="{ fontSize }"
    >
      <div
        ref="container"
        @beforeinput="
          () => {
            return !commentable
          }
        "
        @click="handleEditorClick($event)"
        @mousedown="(e) => (commentable ? ImageSelection.onMouseDown(e) : null)"
        @mousemove="(e) => (commentable ? ImageSelection.onMouseMove(e) : null)"
      ></div>
    </div>
    <quill-comment-popup
      v-model="comment as PositionedComment & PositionedImageComment"
      :comment-types="commentTypes"
      @submit="onCommentSubmit()"
    />
    <quill-comment-popup
      v-model="imageComment"
      :comment-types="commentTypes"
      @submit="onImageCommentSubmit()"
    />
    <quill-comment-modal
      v-model:visible="comment.visible.modal"
      :position-x="comment.x"
      :position-y="comment.y"
      :comment="comment as unknown as Comment & ImageComment"
      :editable="mode === 'commentable'"
      @delete="onCommentRemove()"
    />
    <quill-comment-modal
      v-model:visible="imageComment.visible.modal"
      :position-x="imageComment.popupPosition.x"
      :position-y="imageComment.popupPosition.y"
      :comment="imageComment"
      :editable="mode === 'commentable'"
      @delete="onImageCommentRemove()"
    />
  </div>
  <div
    class="quill-snippets"
    v-if="props.snippets?.length && !props.readonly"
  >
    <template
      v-for="snippet in props.snippets"
      :key="snippet.id"
    >
      <div
        class="quill-snippets__snippet"
        @click="insertSnippet(snippet.content)"
      >
        {{ snippet.name }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { DeltaContentType } from '@/types/composed/DeltaContentType'
import {
  onBeforeUnmount,
  onMounted,
  onUpdated,
  reactive,
  ref,
  computed
} from 'vue'
import { v4 as uuid } from 'uuid'
import { CustomQuill, type Toolbar } from './quill'
import { Range as QuillRange } from 'quill/core/selection'
import { CommentBlot, type Comment } from './CommentBlot'
import { ImageCommentBlot, type ImageComment } from './ImageCommentBlot'
import * as ImageSelection from './ImageSelection'
import type { UserSettings } from '@/core/data/entities/UserSettings'
import type { Snippet } from '@/core/data/entities/Snippet'
import { Delta } from 'quill/core'

interface Props {
  modelValue: DeltaContentType
  readonly?: boolean
  commentable?: boolean
  commentTypes?: string[]
  allowImageRotation?: boolean
  fontSize?: UserSettings['fontSize']
  cursorPosition?: number
  snippets?: Snippet[]
}

interface Emits {
  (e: 'update:modelValue', value: DeltaContentType): void
  (e: 'update:cursorPosition', value?: number): void
  (e: 'commented', value: DeltaContentType): void
}

interface Prompt {
  visible: boolean
  label: string
  action: (value: string) => void | Promise<void>
}

interface PositionedComment extends Comment {
  visible: {
    modal?: boolean
    popup?: boolean
  }
  range: QuillRange | null
  x: number
  y: number
}

interface PositionedImageComment extends ImageComment {
  visible: {
    modal?: boolean
    popup?: boolean
  }
  popupPosition: {
    x: number
    y: number
  }
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

let quill: CustomQuill | null = null

const container = ref<HTMLElement | null>(null)
const id = uuid()
const mode = props.commentable
  ? 'commentable'
  : props.readonly
  ? 'readonly'
  : 'full'

const fontSize = computed(() => {
  switch (props.fontSize) {
    case 'small':
      return '0.8em'
    case 'large':
      return '1.2em'
    default:
      return '1em'
  }
})

const comment = ref<PositionedComment>({
  content: '',
  type: 'logic-error',
  visible: {
    modal: false,
    popup: false
  },
  range: null,
  x: 0,
  y: 0
})

const imageComment = ref<PositionedImageComment>({
  content: '',
  type: 'logic-error',
  visible: {
    modal: false,
    popup: false
  },
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  imageSrc: '',
  imageSize: {
    width: 0,
    height: 0
  },
  popupPosition: {
    x: 0,
    y: 0
  }
})

const prompt = ref<Prompt>({
  visible: false,
  label: '',
  action: () => {}
})

/**
 * On comment creation
 */
function onCommentSubmit() {
  quill?.comment(comment.value.range!, {
    content: comment.value.content,
    type: comment.value.type
  })

  comment.value.visible.popup = false
  comment.value.content = ''

  emits('commented', quill!.getContents())
}

/**
 * On comment remove
 */
function onCommentRemove() {
  quill?.removeComment(comment.value)
  comment.value.visible.modal = false
  emits('commented', quill!.getContents())
}

/**
 * On comment click (any mode!!!)
 */
function onCommentClick(_comment: Comment) {
  const clickedSelection = quill?.getSelection()

  // change selection to cover the whole comment blot
  const [currentElement] = quill?.getLeaf(clickedSelection?.index || 0) || []

  if (!currentElement) {
    return
  }

  const commentBlot = currentElement.parent
  let parent = commentBlot.parent
  let index = commentBlot.offset()

  while (parent) {
    index += parent.offset()
    parent = parent.parent
  }

  const range = {
    index,
    length: commentBlot.length() || 0
  }

  const position = quill?.getBounds(range.index, range.length)

  comment.value = {
    ..._comment,
    visible: {
      modal: true,
      popup: false
    },
    range,
    x: position?.left || 0,
    y: position?.bottom || 0
  }
}

/**
 * Show comment popup
 */
function showCommentPopup(range: QuillRange) {
  if (!range?.length) {
    return
  }

  const position = quill?.getBounds(range.index, range.length)

  imageComment.value.visible = { modal: false, popup: false }

  if (position) {
    comment.value = {
      content: '',
      type: 'logic-error',
      visible: {
        modal: false,
        popup: true
      },
      range,
      x: position.left,
      y: position.bottom
    }
  }
}

/**
 * On image comment creation
 */
function onImageCommentSubmit() {
  quill?.commentImage(imageComment.value)

  imageComment.value.visible.popup = false
  imageComment.value.content = ''

  ImageSelection.removeAllSelections(quill!)
  emits('commented', quill!.getContents())
}

/**
 * On image comment remove
 */
function onImageCommentRemove() {
  quill?.removeImageComment(imageComment.value)
  imageComment.value.visible.modal = false
  emits('commented', quill!.getContents())
}

/**
 * On image comment click (any mode!!!)
 */
function onImageCommentClick(_comment: PositionedImageComment) {
  comment.value.visible = { modal: false, popup: false }
  imageComment.value = {
    ..._comment,
    visible: {
      modal: true,
      popup: false
    }
  }
}

/**
 * Show image comment popup
 */
function showImageCommentPopup(comment: ImageComment | null) {
  if (!comment) {
    return
  }

  const { x, y, height, imageSrc, image } = comment
  const container = image?.closest('.ql-image') as HTMLElement | null

  if (!image || !container || !imageSrc) {
    return 0
  }
  const offsetX = image.offsetLeft + container.offsetLeft
  const offsetY = image.offsetTop + container.offsetTop

  imageComment.value = {
    ...comment,
    visible: { modal: false, popup: true },
    x,
    y,
    popupPosition: {
      x: x + offsetX,
      y: y + offsetY + height - 10
    }
  }
}

/**
 * Toolbar configuration
 */
const toolbar = reactive<Toolbar>([
  [
    {
      type: 'bold',
      value: true,
      title: 'Жирный',
      icon: 'bold',
      active: false
    },
    {
      type: 'italic',
      value: true,
      title: 'Курсив',
      icon: 'italic',
      active: false
    },
    {
      type: 'underline',
      value: true,
      title: 'Подчеркнутый',
      icon: 'underline',
      active: false
    },
    {
      type: 'strike',
      value: true,
      title: 'Зачеркнутый',
      icon: 'strike',
      active: false
    }
  ],
  [
    {
      type: 'script',
      value: 'sub',
      title: 'Подстрочный',
      icon: 'subscript',
      active: false
    },
    {
      type: 'script',
      value: 'super',
      title: 'Надстрочный',
      icon: 'superscript',
      active: false
    }
  ],
  [
    {
      type: 'link',
      value: 'true',
      title: 'Ссылка',
      icon: 'link',
      active: false,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      action: (index) => {
        prompt.value.label = 'Введите URL ссылки'
        prompt.value.visible = true
        prompt.value.action = (value: string) => {
          quill?.format('link', value)
          return Promise.resolve()
        }
      }
    },
    {
      type: 'image',
      value: 'NEVER',
      title: 'Изображение',
      icon: 'image',
      active: false
    },
    {
      type: 'video',
      value: 'NEVER',
      title: 'Видео',
      icon: 'video',
      active: false,
      action: (index) => {
        prompt.value.label = 'Введите URL видео'
        prompt.value.visible = true
        prompt.value.action = (value: string) => {
          if (!value?.length) {
            return Promise.resolve()
          }

          quill?.insertEmbed(index, 'video', value)
          return Promise.resolve()
        }
      }
    },
    {
      type: 'formula',
      value: 'NEVER',
      title: 'Формула',
      icon: 'formula',
      active: false,
      action: (index) => {
        prompt.value.label = 'Введите формулу в формате LaTeX'
        prompt.value.visible = true
        prompt.value.action = (value: string) => {
          if (!value?.length) {
            return Promise.resolve()
          }

          quill?.insertEmbed(index, 'formula', value)
          return Promise.resolve()
        }
      }
    }
  ],
  [
    {
      type: 'align',
      value: false,
      title: 'Выровнять по левому краю',
      icon: 'align-left',
      active: false
    },
    {
      type: 'align',
      value: 'center',
      title: 'Выровнять по центру',
      icon: 'align-center',
      active: false
    },
    {
      type: 'align',
      value: 'right',
      title: 'Выровнять по правому краю',
      icon: 'align-right',
      active: false
    },
    {
      type: 'align',
      value: 'justify',
      title: 'Выровнять по ширине',
      icon: 'align-justify',
      active: false
    }
  ],
  [
    {
      type: 'header',
      value: 1,
      title: 'Большой заголовок',
      icon: 'header',
      active: false
    },
    {
      type: 'header',
      value: 2,
      title: 'Маленький заголовок',
      icon: 'header-2',
      active: false
    },
    {
      type: 'header',
      value: false,
      title: 'Обычный текст',
      icon: 'clean',
      active: false
    }
  ],
  [
    {
      type: 'list',
      value: 'ordered',
      title: 'Нумерованный список',
      icon: 'list-ordered',
      active: false
    },
    {
      type: 'table',
      value: 'NEVER',
      title: 'Таблица',
      icon: 'table',
      active: false
    },
    {
      type: 'table-insert-column',
      value: 'NEVER',
      title: 'Добавить ряд',
      icon: 'table-insert-columns',
      active: false
    },
    {
      type: 'table-delete-column',
      value: 'NEVER',
      title: 'Удалить столбец',
      icon: 'table-delete-columns',
      active: false
    },
    {
      type: 'table-insert-row',
      value: 'NEVER',
      title: 'Добавить столбец',
      icon: 'table-insert-rows',
      active: false
    },
    {
      type: 'table-delete-row',
      value: 'NEVER',
      title: 'Удалить строку',
      icon: 'table-delete-rows',
      active: false
    }
  ],
  [
    {
      type: 'color',
      value: 'var(--danger)',
      title: 'Цвет текста',
      icon: 'color',
      active: false
    },
    {
      type: 'color',
      value: 'var(--warning)',
      title: 'Цвет текста',
      icon: 'color',
      active: false
    },
    {
      type: 'color',
      value: 'var(--success)',
      title: 'Цвет текста',
      icon: 'color',
      active: false
    },
    {
      type: 'color',
      value: 'var(--lila)',
      title: 'Цвет текста',
      icon: 'color',
      active: false
    },
    {
      type: 'color',
      value: 'var(--primary)',
      title: 'Цвет текста',
      icon: 'color',
      active: false
    }
  ]
])

/**
 * Handle click events inside the editor
 */
function handleEditorClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  const classNames = target.className

  if (classNames.includes(CommentBlot.className)) {
    const data = CommentBlot.value(target)
    onCommentClick(data)
    return
  }

  if (classNames.includes('delete-button')) {
    const src = target.parentNode?.parentNode?.querySelector('img')?.src

    if (!src) {
      return
    }

    quill?.deleteImage(src)

    emits('update:modelValue', quill!.getContents())
    return
  }

  if (classNames.includes('ql-image-comment-selection')) {
    const height = target.dataset.height ? parseInt(target.dataset.height) : 0
    const width = target.dataset.width ? parseInt(target.dataset.width) : 0
    const content = target.dataset.comment
    const type = target.dataset.type as Comment['type']

    const imageComments = quill!.root.querySelectorAll(
      '.ql-image-comment'
    ) as NodeListOf<HTMLElement>
    const commentNode = Array.from(imageComments).find(
      (node) =>
        parseInt(node.dataset.width!) === width &&
        parseInt(node.dataset.height!) === height &&
        node.dataset.comment === content &&
        node.dataset.type === type
    )

    if (!commentNode) {
      return
    }

    const data = ImageCommentBlot.formats(commentNode)

    let imageContainer = commentNode.nextElementSibling as HTMLImageElement

    while (imageContainer && !imageContainer.classList.contains('ql-image')) {
      imageContainer = imageContainer.nextElementSibling as HTMLImageElement
    }

    const image = imageContainer.querySelector('img') as HTMLImageElement | null

    const positionedComment: PositionedImageComment = {
      ...data,
      visible: {
        modal: false,
        popup: false
      },
      popupPosition: {
        x: imageContainer.offsetLeft + (image?.offsetLeft || 0) + data.x,
        y:
          imageContainer.offsetTop +
          (image?.offsetTop || 0) +
          data.y +
          data.height -
          10
      }
    }
    onImageCommentClick(positionedComment)
    return
  }
}

/**
 * Initialize quill
 */
async function initQuill() {
  return new Promise<void>((resolve) => {
    quill = new CustomQuill(container, props.modelValue, mode, toolbar)

    quill.on('text-change', () => {
      emits('update:modelValue', quill!.getContents())
    })

    quill.on('selection-change', (range) => {
      emits('update:cursorPosition', range?.index ?? 0)
    })

    if (mode === 'commentable') {
      quill.on('selection-change', showCommentPopup)
    }

    resolve()
  })
}

onMounted(async () => {
  await initQuill()
  syncImageSelections()
})

/**
 * Handling image comment popup creation
 */
const abortController = new AbortController()

if (props.commentable) {
  window.addEventListener(
    'mouseup',
    (e) => {
      showImageCommentPopup(ImageSelection.onMouseUp(e))
    },
    { signal: abortController.signal }
  )
}

onBeforeUnmount(() => abortController.abort())

onUpdated(() => syncImageSelections())

function syncImageSelections() {
  ImageSelection.removeAllSelections(quill!)
  ImageSelection.drawAllSelections(quill!)
}

function insertSnippet(content: DeltaContentType) {
  if (!quill) {
    return
  }

  const range = quill.getSelection(true)
  const delta = new Delta(content.ops)

  // Clone the delta to avoid mutating the original
  let cleanedDelta = new Delta(delta)

  // Remove trailing newline if it exists in the delta
  const ops = cleanedDelta.ops || []
  if (ops.length > 0) {
    const lastOp = ops[ops.length - 1]
    if (typeof lastOp.insert === 'string' && lastOp.insert.endsWith('\n')) {
      lastOp.insert = lastOp.insert.replace(/\n$/, '')
      // Remove op if it becomes empty
      if (lastOp.insert === '') {
        ops.pop()
      }
      cleanedDelta = new Delta(ops)
    }
  }

  if (!range) {
    // No selection/cursor – append at the end
    const length = quill.getLength()
    quill.updateContents(
      // @ts-ignore
      new Delta().retain(length).concat(cleanedDelta)
    )
    quill.setSelection(length + cleanedDelta.length(), 0)
    return
  }

  // Insert at cursor position
  quill.updateContents(
    // @ts-ignore
    new Delta().retain(range.index).concat(delta)
  )

  // Move cursor to after inserted content
  quill.setSelection(range.index + delta.length(), 0)
}
</script>

<style lang="sass" scoped>
.quill-editor
  max-width: 100%
  border-radius: var(--border-radius)
  position: relative

  &__content
    padding: 0.5em
    transition: height 0.3s ease

    &:not(&--allow-image-rotation)
      :deep()
        .ql-image
          .rotate-left-button,
          .rotate-right-button
            display: none !important

    :deep()
      .ql-image
        z-index: 1
        position: relative
        width: fit-content

        img
          border: 1px solid var(--border-color)
          border-radius: var(--border-radius)
          display: block

        &::after
          z-index: -1
          content: ''
          position: absolute
          display: block
          top: 50%
          left: 50%
          width: 40px
          height: 40px
          margin: -20px 0 0 -20px
          border: 4px solid var(--lila)
          border-top: 4px solid transparent
          border-radius: 50%
          animation: spin 1s linear infinite

        .actions
          position: absolute
          top: 20px
          right: 10px
          display: flex
          gap: 5px
          flex-direction: column
          align-items: center

          .rotate-left-button,
          .rotate-right-button
            display: block
            cursor: pointer
            background: var(--form-background)
            color: var(--form-text-color)
            border-radius: var(--border-radius)
            border: none

            &:hover
              background: var(--light)


    &:not(&--readonly)
      :deep()
        .ql-image
          .delete-button
            display: none !important
            justify-content: center
            align-items: center
            color: white
            width: 30px
            height: 30px
            border-radius: 50%
            font-size: 32px
            line-height: 1
            text-align: center
            transform: rotate(45deg)
            cursor: pointer
            border: none
            background-color: var(--text-light)

            &:hover
              background-color: var(--dark)

          &:hover
            .delete-button
              display: flex !important

    :deep()
      .ql-editor
        outline: none
        white-space: pre-wrap
        overflow-wrap: break-word

        p, b, i, strong, em, u, strike, sub, sup, blockquote, ul, ol, li, h1, h2, h3, h4, h5, h6
          background-color: transparent !important
          color: var(--form-text-color) !important

      p
        margin: 0

      img
        border-radius: var(--border-radius)
        margin: 0.5em 0
        max-width: 100%

      .ql-image
        position: relative

        .delete-button
          display: none !important

      a
        color: var(--lila)
        background-color: transparent !important
        text-decoration: underline

      iframe.ql-video
        width: 100%
        aspect-ratio: 1.5

      .ql-align-center
        text-align: center

      .ql-align-right
        text-align: right

      .ql-align-justify
        text-align: justify

      table
        border-collapse: separate
        border-spacing: 0
        width: auto
        max-width: 100%

        td
          border: 1px solid var(--form-text-color)
          min-width: 3em
          padding: 0.5em 1em

        tr:first-child td:first-child
          border-top-left-radius: var(--border-radius)

        tr:first-child td:last-child
          border-top-right-radius: var(--border-radius)

        tr:last-child td:first-child
          border-bottom-left-radius: var(--border-radius)

        tr:last-child td:last-child
          border-bottom-right-radius: var(--border-radius)

      .qlbt-selection-line
        display: none

      .ql-comment
        border-radius: var(--border-radius)
        background-color: transparent !important
        color: var(--form-text-color) !important
        padding: 0.1em 0.5em
        display: inline-block
        cursor: pointer
        border: 2px dashed var(--lila)

        &[data-type='fact-error']
          border-color: var(--danger) !important

        &[data-type='logic-error']
          border-color: var(--warning) !important

        &[data-type='...']
          border-color: var(--text-light) !important

        &:hover
          border-color: var(--border-color) !important

      .ql-image-comment
        display: inline-block
        opacity: 0.5
        border: 2px solid var(--lila)
        color: transparent !important
        border-radius: var(--border-radius)
        padding: 0em 0.4em
        cursor: pointer
        transition: opacity 0.3s ease
        margin-top: 0.5em
        margin-right: 0.5em

        &::before
          content: '↓ Комментарий'
          height: 1em
          width: 1em
          border-radius: 50%
          color: var(--lila)
          font-weight: 600
          font-size: 0.8em

      .ql-image-comment-selection
        display: block
        position: absolute
        background-color: #00000055
        border: 3px dashed var(--lila)
        cursor: pointer
        z-index: 999
        transition: opacity 0.3s ease
        min-width: 15px
        min-height: 15px

        &:hover
          opacity: 0.8

        &::before
          content: ''
          height: 1em
          width: 1em
          border-radius: 50%
          background-color: var(--lila)

.quill-snippets
  border-top: 1px solid var(--border-color)
  padding: 0.5em
  display: flex
  flex-wrap: wrap
  gap: 0.5em

  &__snippet
    font-size: 12px
    color: var(--form-text-color)
    cursor: pointer
    border: 1px dashed var(--border-color)
    padding: 0.5em 1em
    border-radius: var(--border-radius)

    &:hover
      background-color: var(--border-color)

@keyframes spin
  from
    transform: rotate(0deg)
  to
    transform: rotate(360deg)
</style>
