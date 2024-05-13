<template>
  <div class="quill-editor">
    <quill-toolbar
      :visible="mode === 'full'"
      :toolbar="toolbar"
      :id="id"
      @format="quill?.toggleFormat($event.type, $event.value, $event.action)"
    />
    <div
      class="quill-editor__input"
      v-auto-animate
    >
      <div
        class="quill-editor__input__inner"
        v-if="input.visible"
      >
        <div class="quill-editor__input__label">
          <label>{{ input.label }}</label>
        </div>
        <div class="quill-editor__input__field">
          <input
            type="url"
            v-model="input.value"
            @keypress.enter="onInputOk()"
          />
        </div>
        <div class="quill-editor__input__actions">
          <button
            class="quill-editor__input__actions__ok"
            @click="onInputOk()"
          >
            Ок
          </button>
          <button
            class="quill-editor__input__actions__cancel"
            @click="input.visible = false"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
    <div class="quill-editor__content">
      <div
        ref="container"
        @beforeinput="
          () => {
            return !commentable
          }
        "
      ></div>
    </div>
    <quill-comment-popup
      v-model="commentPopup"
      @submit="onCommentOk()"
    />
    <quill-comment-modal
      v-model:visible="comment.visible"
      :position="comment.position"
      :comment="comment"
      :editable="mode === 'commentable'"
      @delete="onCommentRemove()"
    />
  </div>
</template>

<script setup lang="ts">
import type { DeltaContentType } from '@/types/composed/DeltaContentType'
import { onMounted, reactive, ref } from 'vue'
import { v4 as uuid } from 'uuid'
import { CustomQuill, type Toolbar } from './quill'
import { Range as QuillRange } from 'quill/core/selection'
import { type Comment } from './CommentBlot'

interface Props {
  modelValue: DeltaContentType
  readonly?: boolean
  commentable?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: DeltaContentType): void
  (e: 'commented', value: DeltaContentType): void
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

const input = reactive<{
  value: string
  label: string
  visible: boolean
  action: () => void | Promise<void>
}>({
  value: '',
  label: '',
  visible: false,
  action: () => {}
})

function openInput(label: string, action: () => void) {
  input.label = label
  input.action = action
  input.visible = true
}

async function onInputOk() {
  const result = input.action()

  if (result instanceof Promise) {
    await result
  }

  input.visible = false
  input.value = ''
}

const commentPopup = reactive<
  Comment & {
    visible: boolean
    x: number
    y: number
    range: QuillRange | null
  }
>({
  content: '',
  type: 'logic-error',
  visible: false,
  x: 0,
  y: 0,
  range: null
})

function onCommentOk() {
  quill?.comment(
    commentPopup.range!,
    {
      content: commentPopup.content,
      type: commentPopup.type
    },
    onCommentClick
  )

  commentPopup.visible = false
  commentPopup.content = ''
  emits('commented', quill!.getContents())
}

function onCommentRemove() {
  quill?.removeComment(comment.value)
  comment.value.visible = false
}

function onCommentClick(_comment: Comment) {
  if (comment.value.visible) {
    comment.value.visible = false
    return
  }

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

  const selection = {
    index,
    length: commentBlot.length() || 0
  }

  const position = quill?.getBounds(selection.index, selection.length)

  console.log(selection, position)

  comment.value = {
    ..._comment,
    visible: true,
    selection,
    position: {
      x: position?.left || 0,
      y: position?.bottom || 0
    }
  }
}

const comment = ref<
  Comment & {
    visible: boolean
    selection: QuillRange | null
    position: { x: number; y: number }
  }
>({
  content: '',
  type: 'logic-error',
  visible: false,
  selection: null,
  position: { x: 0, y: 0 }
})

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
      action: (index) =>
        openInput('Введите URL ссылки', () => {
          quill?.format('link', input.value as string)
          return Promise.resolve()
        })
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
      action: (index) =>
        openInput('Введите URL видео', () => {
          quill?.insertEmbed(index, 'video', input.value as string)
          return Promise.resolve()
        })
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
      type: 'list',
      value: 'bullet',
      title: 'Список',
      icon: 'list-bullet',
      active: false
    }
  ]
])

onMounted(async () => await initQuill())

async function initQuill() {
  return new Promise<void>((resolve) => {
    quill = new CustomQuill(container, props.modelValue, mode, toolbar)

    quill.on('text-change', () => {
      emits('update:modelValue', quill!.getContents())
    })

    quill.onCommentClick(onCommentClick)

    if (mode === 'commentable') {
      quill.on('selection-change', (range) => {
        if (!range || !range?.length) {
          return
        }

        const position = quill?.getBounds(range.index, range.length)

        if (position) {
          commentPopup.x = position.left
          commentPopup.y = position.bottom
          commentPopup.visible = true
          commentPopup.range = range
        }
      })
    }

    resolve()
  })
}
</script>

<style lang="sass" scoped>
.quill-editor
  max-width: 100%
  border-radius: var(--border-radius)
  position: relative

  &__input
    overflow: hidden

    &__inner
      display: flex
      align-items: center
      padding: 0.5em
      gap: 0.5em
      border-bottom: 1px solid var(--border-color)

    &__label
      font-size: 0.9em

    &__field
      flex: 1

      input
        width: 100%
        overflow-y: auto
        resize: none
        padding: 0.5em
        border: 1px solid var(--border-color)
        border-radius: var(--border-radius)
        background: var(--form-background)
        color: var(--form-text-color)

        &:focus
          outline: none
          border-color: var(--primary)

    &__actions
      display: flex
      justify-content: flex-end

      &__ok, &__cancel
        border: 1px solid transparent
        border-radius: var(--border-radius)
        cursor: pointer
        font-size: 0.9em
        margin-left: 0.5em
        padding: 0.25em 0.5em

      &__ok
        border-color: var(--secondary)
        background-color: var(--secondary)
        color: var(--form-text-color)

        &:hover
          background-color: transparent
          color: var(--form-text-color)

      &__cancel
        border-color: var(--dark)
        background-color: var(--dark)
        color: var(--white)

        &:hover
          background-color: var(--border-color)
          color: var(--dark)

  &__content
    padding: 0.5em
    transition: height 0.3s ease

    :deep()
      .ql-editor
        outline: none

      span, p, b, i, strong, em, u, strike, sub, sup, blockquote, ul, ol, li, h1, h2, h3, h4, h5, h6
        background-color: transparent !important
        color: var(--form-text-color) !important

      p
        margin: 0

      img
        border-radius: var(--border-radius)
        margin: 0.5em 0
        max-width: 100%

      a
        color: var(--lila)
        background-color: transparent !important
        text-decoration: underline

      .ql-align-center
        text-align: center

      .ql-align-right
        text-align: right

      .ql-align-justify
        text-align: justify

      .ql-comment
        border-radius: var(--border-radius)
        color: var(--white)
        padding: 0.1em 0.5em
        display: inline-block
        cursor: pointer
        border: 2px dashed transparent

        &[data-type='fact-error']
          border-color: var(--danger) !important

        &[data-type='logic-error']
          border-color: var(--warning) !important

        &:hover
          border-color: var(--border-color) !important
</style>
