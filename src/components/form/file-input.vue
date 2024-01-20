<template>
  <div class="file-input">
    <input
      ref="fileInput"
      type="file"
      :accept="allowedMimeTypes.join(', ')"
      :multiple="multiple"
      @change="onFilesChange()"
      area-hidden="true"
      hidden
    />
    <label class="file-input__label">{{ label }}</label>
    <div
      class="file-input__area"
      :class="{ 'file-input__area--drag': drag }"
      @click=";($refs.fileInput as HTMLInputElement).click()"
      @dragenter.prevent="onDragEnter()"
      @dragleave.prevent="onDragLeave()"
      @dragover.prevent
      @mouseleave="onDragLeave()"
      @drop.prevent="onFilesDropped($event)"
    >
      Перетащите сюда файл или кликните, чтобы загрузить
    </div>
    <div
      class="file-input__files"
      v-auto-animate
    >
      <div
        class="file-input__files__file"
        v-for="file in files"
        :key="file.id"
      >
        <div class="file-input__files__file__preview">
          <inline-icon :name="`jpg-file`" />
          <!-- <inline-icon
            :name="`${file.extension === 'jpeg' ? 'jpg' : file.extension}-file`"
          /> -->
        </div>
        <div class="file-input__files__file__data">
          <p class="file-input__files__file__data__name">{{ file.fileName }}</p>
          <div
            class="file-input__files__file__data__error"
            v-if="file.error"
          >
            <p>Ошибка: {{ file.error }}</p>
          </div>
          <div
            class="file-input__files__file__data__progress"
            v-else-if="!file.isUploaded"
          >
            <progress-bar :value="file.progress" />
          </div>
        </div>
        <div class="file-input__files__file__actions">
          <div class="file-input__files__file__actions__delete">
            <inline-icon
              name="delete"
              @click="removeFile(file)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/store'
import { computed, ref } from 'vue'
import { v4 as uuid } from 'uuid'
import { http } from '@/utils/http'
import type { Media } from '@/types/entities/Media'

interface Props {
  label: string
  modelValue: (Omit<Media, 'id' | 'createdAt'> & {
    id: Media['id'] | undefined
  })[]
  allowedMimeTypes: ('image/png' | 'image/jpeg' | 'application/pdf')[]
  maxFileSize?: number
  multiple?: boolean
  maxCount?: number
}

interface Emits {
  (
    event: 'update:modelValue',
    value: (Omit<Media, 'id' | 'createdAt'> & { id: Media['id'] | undefined })[]
  ): void
}

const props = withDefaults(defineProps<Props>(), {
  allowedMimeTypes: () => ['image/png', 'image/jpeg'],
  maxFileSize: 3 * 1024 * 1024,
  multiple: false,
  maxCount: 5
})
const emits = defineEmits<Emits>()

const globalStore = useGlobalStore()

interface FileItem {
  key: string
  id?: string
  fileName: string
  src: string
  extension: 'png' | 'jpeg' | 'pdf'
  progress: number
  isUploaded: boolean
  error: string
  file: File | null
}

const files = computed<FileItem[]>({
  get() {
    return props.modelValue.map((media) => ({
      id: media.id,
      key: uuid(),
      fileName: media.src.split('/').pop() as string,
      src: media.src,
      extension: media.src.split('.').pop() as FileItem['extension'],
      progress: 100,
      isUploaded: true,
      error: '',
      file: null
    }))
  },
  set(value) {
    emits(
      'update:modelValue',
      value.map((file) => ({
        id: file.id,
        src: file.src,
        mimeType:
          file.extension === 'pdf'
            ? 'application/pdf'
            : file.extension === 'png'
            ? 'image/png'
            : 'image/jpeg'
      }))
    )
  }
})

const fileInput = ref<HTMLInputElement | null>(null)
const drag = ref(false)

let dragTimeoutId = 0

function onDragEnter() {
  drag.value = true
  clearTimeout(dragTimeoutId)
}

function onDragLeave() {
  dragTimeoutId = setTimeout(() => {
    drag.value = false
  }, 50)
}

function onFilesChange() {
  if (
    props.maxCount &&
    files.value.length + (fileInput.value?.files?.length || 0) > props.maxCount
  ) {
    return
  }
  uploadFiles(Array.from(fileInput.value?.files || []))
}

function onFilesDropped(event: DragEvent) {
  const _files = Array.from(event.dataTransfer?.files || [])

  if (
    props.multiple &&
    props.maxCount &&
    files.value.length + (_files.length || 0) > props.maxCount
  ) {
    globalStore.openModal(
      'error',
      `Превышен лимит файлов, которые можно загрузить. Можно загрузить не более ${props.maxCount} файлов`
    )
    return
  }

  if (!props.multiple) {
    uploadFiles(_files.slice(0, 1))
    return
  }

  uploadFiles(_files)
}

function uploadFiles(_files: File[]) {
  const fileItems: FileItem[] = Array.from(_files).map((file) => ({
    key: uuid(),
    fileName: file.name,
    src: '',
    extension: file.name.split('.').pop() as any,
    progress: 10,
    isUploaded: false,
    error: '',
    file
  }))

  for (const file of fileItems) {
    if (!file.file) continue

    if (!props.allowedMimeTypes.includes(file.file.type as any)) {
      file.error = 'Этот тип файла не поддерживается'
      files.value.push(file)
      continue
    }

    if (file.file.size > props.maxFileSize) {
      file.error = `Размер файла привышает допустимый (${Math.floor(
        props.maxFileSize / 1024 / 1024
      )} МБ})`
      files.value.push(file)
      continue
    }

    // upload file
    http
      .file([file.file])
      .then((response) => {
        file.src = response.links[0]
        file.isUploaded = true
      })
      .catch((error) => {
        file.error = error
      })
      .finally(() => {
        file.progress = 100
        files.value = [...files.value, file]
      })
  }
}

function removeFile(file: FileItem) {
  files.value = files.value.filter((_file) => _file.id !== file.id)
}
</script>

<style scoped lang="sass">
.file-input
  position: relative
  width: 100%
  height: 100%
  overflow: hidden

  &__area
    margin: 0 0 0.5em 0
    height: 6em
    border: 1px dashed var(--border-color)
    border-radius: var(--border-radius)
    display: flex
    align-items: center
    justify-content: center
    cursor: pointer
    font-size: 0.8em
    color: var(--text-light)
    padding: 1em
    text-align: center

    &:hover
      border-color: var(--primary)
      border-style: solid

    &--drag
      border-color: var(--secondary)
      border-style: solid
      background-color: var(--secondary)
      color: var(--lightest)

  &__label
    padding: 1em 0
    font-size: 0.8em
    color: var(--text-light)
    cursor: pointer

  &__files
    display: flex
    flex-direction: column
    gap: 0.2em

    &__file
      display: flex
      align-items: center
      padding: 0.3em 0
      border: 1px solid var(--border-color)
      border-radius: var(--border-radius)

      &__preview
        width: 50px
        height: 50px
        margin-right: 1em
        margin-left: 0.3em
        font-size: 45px

      &__data
        flex-grow: 1

        &__name
          margin: 0
          font-size: 0.9em
          font-weight: 500
          color: var(--text-light)

        &__error
          p
            margin: 0
            font-size: 0.8em
            font-weight: 500
            color: var(--danger)

        &__progress
          margin: 0.5em 0

      &__actions
        display: flex
        align-items: center
        margin: 0 1em

        &__delete
          cursor: pointer
          transition: transform 0.1s ease-in-out

          &:hover
            transform: scale(1.2)
</style>
