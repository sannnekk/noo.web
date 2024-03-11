<template>
  <div class="file-input">
    <input
      ref="fileInput"
      type="file"
      :accept="allowedMimeTypes.join(', ')"
      :multiple="!!maxCount && maxCount > 1"
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
          <inline-icon
            v-if="file.src && file.extension === 'pdf'"
            name="pdf-file"
          />
          <uploaded-image
            v-else
            :src="file.src"
          />
        </div>
        <div class="file-input__files__file__data">
          <p class="file-input__files__file__data__name">
            {{ file.fileName }} | {{ file.progress }}
          </p>
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
  <crop-modal
    v-model:visible="cropModalVisible"
    v-model:files="filesForUpload"
    @confirm="sendFiles()"
    @cancel="filesCancel()"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { v4 as uuid } from 'uuid'
import type { Media } from '@/core/data/entities/Media'
import { type FileItem } from '@/types/composed/FileItem'
import { Core } from '@/core/Core'

interface Props {
  label: string
  modelValue: (Omit<Media, 'id' | 'createdAt'> & {
    id: Media['id'] | undefined
  })[]
  allowedMimeTypes: ('image/png' | 'image/jpeg' | 'application/pdf')[]
  maxFileSize?: number
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
  maxCount: 5
})

const emits = defineEmits<Emits>()

const files = computed<FileItem[]>({
  get() {
    return (props.modelValue || []).map((media) => ({
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

const filesForUpload = ref<FileItem[]>([])

const fileInput = ref<HTMLInputElement | null>(null)
const drag = ref(false)

const cropModalVisible = ref(false)

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
    return Core.Services.UI.openWarningModal(
      `Превышен лимит файлов, которые можно загрузить. Можно загрузить не более ${props.maxCount} файлов`
    )
  }
  uploadFiles(Array.from(fileInput.value?.files || []))
}

function onFilesDropped(event: DragEvent) {
  const _files = Array.from(event.dataTransfer?.files || [])

  if (
    props.maxCount &&
    files.value.length + (_files.length || 0) > props.maxCount
  ) {
    Core.Services.UI.openWarningModal(
      `Превышен лимит файлов, которые можно загрузить. Можно загрузить не более ${props.maxCount} файлов`
    )
    return
  }

  uploadFiles(_files)
}

async function uploadFiles(_files: File[]) {
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
      filesForUpload.value.push(file)
      continue
    }

    if (file.file.size > props.maxFileSize) {
      file.error = `Размер файла привышает допустимый (${Math.floor(
        props.maxFileSize / 1024 / 1024
      )} МБ})`
      filesForUpload.value.push(file)
      continue
    }

    filesForUpload.value.push(file)
  }

  cropModalVisible.value = true
}

async function sendFiles() {
  cropModalVisible.value = false
  for (const file of filesForUpload.value) {
    try {
      files.value.push(file)

      const response = await Core.Services.Media.upload(
        [file.file as File],
        (progress) => {
          file.progress = progress
        }
      )

      if (!response || !response.data) {
        Core.Services.UI.openErrorModal('Ошибка при загрузке файла')
        continue
      }

      if ('links' in response.data === false) {
        Core.Services.UI.openErrorModal('Ошибка при загрузке файла')
        continue
      }

      file.src = response.data.links[0]
      file.isUploaded = true
      file.progress = 100
      emits(
        'update:modelValue',
        files.value.map((file) => ({
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
    } catch (error: any) {
      file.error = error.message
    }
  }

  filesForUpload.value = []
}

function removeFile(file: FileItem) {
  files.value = files.value.filter((_file) => _file.key !== file.key)
}

function filesCancel() {
  filesForUpload.value = []
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
      padding: 0.8em 0
      border: 1px solid var(--border-color)
      border-radius: var(--border-radius)

      &__preview
        width: 50px
        height: 50px
        margin-right: 0.2em
        margin-left: 0.3em
        font-size: 45px
        overflow: hidden
        display: flex
        align-items: center
        justify-content: center
        border: 1px solid var(--border-color)
        border-radius: var(--border-radius)
        background-color: var(--border-color)

        img
          max-height: 100%
          max-width: 100%


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
