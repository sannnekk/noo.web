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
      v-if="!props.readonly"
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
      <draggable-list
        :key="files.length"
        v-model="files"
        item-key="id"
      >
        <template v-slot="{ item }">
          <div class="file-input__files__file">
            <a
              :href="`${Core.Constants.MEDIA_URL}/${item.src}`"
              target="_blank"
              class="file-input__files__file__preview"
            >
              <inline-icon
                v-if="item.src && item.extension === 'pdf'"
                name="pdf-file"
              />
              <uploaded-image
                v-else
                :src="item.src"
              />
            </a>
            <div class="file-input__files__file__data">
              <p class="file-input__files__file__data__name">
                {{ item.fileName }}
              </p>
              <div
                class="file-input__files__file__data__error"
                v-if="item.error"
              >
                <p>Ошибка: {{ item.error }}</p>
              </div>
              <div
                class="file-input__files__file__data__progress"
                v-else-if="!item.isUploaded"
              >
                <progress-bar :value="item.progress" />
              </div>
            </div>
            <div
              class="file-input__files__file__actions"
              v-if="!props.readonly"
            >
              <div class="file-input__files__file__actions__delete">
                <inline-icon
                  name="delete"
                  @click="removeFile(item)"
                />
              </div>
            </div>
          </div>
        </template>
      </draggable-list>
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
import { Core } from '@/core/Core'

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
  order: number
}

interface Props {
  label: string
  modelValue: (Omit<Media, 'id' | 'createdAt'> & {
    id?: Media['id']
  })[]
  allowedMimeTypes: ('image/png' | 'image/jpeg' | 'application/pdf')[]
  maxFileSize?: number
  maxCount?: number
  readonly?: boolean
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
  maxCount: 5,
  readonly: false
})

const emits = defineEmits<Emits>()

const files = computed<FileItem[]>({
  get() {
    return (props.modelValue || []).map((media, index) => ({
      id: media.id,
      key: uuid(),
      fileName: media.name || media.src,
      src: media.src,
      extension: media.src.split('.').pop() as FileItem['extension'],
      progress: 100,
      isUploaded: true,
      error: '',
      file: null,
      order: index
    }))
  },
  set(value) {
    emits(
      'update:modelValue',
      value.map((file, index) => ({
        id: file.id,
        src: file.src,
        name: file.fileName,
        order: index + 1,
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
  }, 50) as any
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

  for (const file of Array.from(fileInput.value?.files || [])) {
    if (!file) continue

    if (!props.allowedMimeTypes.includes(file.type as any)) {
      Core.Services.UI.openWarningModal(
        'Этот тип файла не поддерживается. Поддерживаемые типы: .jpeg, .png, .pdf'
      )
      return
    }

    if (file.size > props.maxFileSize) {
      Core.Services.UI.openWarningModal(
        `Размер файла привышает допустимый (${Math.floor(
          props.maxFileSize / 1024 / 1024
        )} МБ)`
      )
      return
    }
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
  const fileItems: FileItem[] = Array.from(_files).map((file, index) => ({
    key: uuid(),
    fileName: file.name,
    src: '',
    extension: file.name.split('.').pop() as any,
    progress: 1,
    isUploaded: false,
    error: '',
    order: files.value.length + index,
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
      file.error = `Размер файла превышает допустимый (${Math.floor(
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

      file.src = response.data[0].src
      file.fileName = response.data[0].name
      file.extension = response.data[0].mimeType.split('/').pop() as any
      file.isUploaded = true
      file.progress = 100

      emits(
        'update:modelValue',
        files.value.map((file) => ({
          id: file.id,
          src: file.src,
          name: file.fileName,
          mimeType:
            file.extension === 'pdf'
              ? 'application/pdf'
              : file.extension === 'png'
              ? 'image/png'
              : 'image/jpeg',
          order: file.order
        }))
      )
    } catch (error: any) {
      file.error = error.message
    }
  }

  filesForUpload.value = []
}

function removeFile(file: FileItem) {
  if (props.readonly) return

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
        min-width: 50px
        margin-right: 0.2em
        margin-left: 0.3em
        font-size: 45px
        overflow: hidden
        display: flex
        text-decoration: none
        color: currentColor
        align-items: center
        justify-content: center
        border: 1px solid var(--border-color)
        border-radius: var(--border-radius)
        background-color: var(--border-color)

        &:hover
          border-color: var(--primary)

        img
          max-height: 100%
          max-width: 100%


      &__data
        width: calc(100% - 90px)
        overflow: hidden

        &__name
          margin: 0
          font-size: 0.9em
          font-weight: 500
          color: var(--text-light)
          text-overflow: ellipsis
          overflow: hidden

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
