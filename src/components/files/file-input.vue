<template>
  <div class="file-input">
    <input
      ref="fileInput"
      type="file"
      :accept="allowedMimeTypes.join(', ')"
      :multiple="!!maxCount && maxCount > 1"
      @change="onFileInputChange()"
      area-hidden="true"
      hidden
    />
    <label class="file-input__label">{{ label }}</label>
    <div
      v-if="!props.readonly && modelValue.length < props.maxCount"
      class="file-input__area"
      :class="{ 'file-input__area--drag': isDragActive }"
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
        @update:model-value="onReorder($event)"
      >
        <template v-slot="{ item }: { item: ExtendedMedia }">
          <div class="file-input__files__file">
            <a
              :href="
                item.src ? `${Core.Constants.MEDIA_URL}/${item.src}` : void 0
              "
              :target="item.src ? '_blank' : void 0"
              class="file-input__files__file__preview"
            >
              <inline-icon
                v-if="item.src && item.mimeType === 'application/pdf'"
                name="pdf-file"
              />
              <uploaded-image
                v-else
                :src="item.src"
              />
            </a>
            <div class="file-input__files__file__data">
              <p class="file-input__files__file__data__name">
                {{ item.name }}
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
    :files-with-errors="filesWithErrors"
    @confirm="uploadFiles()"
    @cancel="filesCancel()"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Media } from '@/core/data/entities/Media'
import { Core } from '@/core/Core'
import type { WithOptional } from '@/core/type-utils/WithOptional'

export interface ExtendedMedia extends WithOptional<Media, 'id' | 'createdAt'> {
  progress: number
  isUploaded: boolean
  error?: string
  file: File | null
}

interface Props {
  label: string
  modelValue: Media[]
  allowedMimeTypes: ('image/png' | 'image/jpeg' | 'application/pdf')[]
  maxFileSize?: number
  maxCount?: number
  readonly?: boolean
}

interface Emits {
  (event: 'update:modelValue', value: Media[]): void
}

const props = withDefaults(defineProps<Props>(), {
  allowedMimeTypes: () => ['image/png', 'image/jpeg'],
  maxFileSize: 10 * 1024 * 1024,
  maxCount: 5,
  readonly: false
})

const emits = defineEmits<Emits>()

const files = computed<ExtendedMedia[]>({
  get() {
    return (props.modelValue || []).map((media) => ({
      ...media,
      progress: 100,
      isUploaded: true,
      error: undefined,
      file: null
    }))
  },
  set(value) {
    emits('update:modelValue', value as Media[])
  }
})

const filesWithErrors = ref<ExtendedMedia[]>([])

const filesForUpload = ref<ExtendedMedia[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const isDragActive = ref(false)
const cropModalVisible = ref(false)

let dragTimeoutId = 0

function onDragEnter() {
  isDragActive.value = true
  clearTimeout(dragTimeoutId)
}

function onDragLeave() {
  dragTimeoutId = setTimeout(() => {
    isDragActive.value = false
  }, 50) as any
}

function onReorder(newFiles: ExtendedMedia[]) {
  files.value = newFiles.map((file, index) => ({
    ...file,
    order: index
  }))
}

function onFileInputChange() {
  const selectedFiles = Array.from(fileInput.value?.files || [])

  if (selectedFiles.length) {
    filesForUpload.value = selectedFiles.map(mediaFromFile)

    validateFiles()
  }
}

function onFilesDropped(event: DragEvent) {
  const droppedFiles = Array.from(event.dataTransfer?.files || [])

  if (droppedFiles.length) {
    filesForUpload.value = droppedFiles.map(mediaFromFile)

    validateFiles()
  }
}

function validateFiles() {
  if (filesForUpload.value.length > props.maxCount) {
    Core.Services.UI.openErrorModal(
      `Максимальное количество файлов (${props.maxCount}) превышено`
    )
    filesForUpload.value = []
    return
  }

  for (const file of filesForUpload.value) {
    if (!file.file) continue

    if (!props.allowedMimeTypes.includes(file.file.type as any)) {
      file.error =
        'Этот тип файла не поддерживается, разрешены: ' +
        props.allowedMimeTypes.join(', ')
      continue
    }

    if (file.file.size > props.maxFileSize) {
      file.error = `Размер файла превышает допустимый (${Math.floor(
        props.maxFileSize / 1024 / 1024
      )} МБ})`
      continue
    }
  }

  filesWithErrors.value = filesForUpload.value.filter((file) => file.error)
  filesForUpload.value = filesForUpload.value.filter((file) => !file.error)

  openFilelistModal()
}

async function uploadFiles() {
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
        throw new Error('Ошибка при загрузке файлов')
      }

      file.src = response.data[0].src
      file.name = response.data[0].name
      file.mimeType = response.data[0].mimeType
      file.isUploaded = true
      file.progress = 100
      file.error = undefined
    } catch (error: any) {
      file.error = error.message
    }
  }

  files.value = files.value
    .filter((file) => !file.error)
    .map((file, index) => ({ ...file, order: index }))

  filesWithErrors.value = filesForUpload.value.filter((file) => file.error)

  filesForUpload.value = []

  if (filesWithErrors.value.length) {
    const errorText = filesWithErrors.value
      .map((file) => {
        return `Файл "${file.name}": ${file.error}`
      })
      .join(', ')

    Core.Services.UI.openErrorModal(
      'Ошибка с загрузкой некоторых файлов',
      errorText
    )

    filesWithErrors.value = []
  }
}

function removeFile(file: ExtendedMedia) {
  if (props.readonly) return

  files.value = files.value.filter((item) => item.name !== file.name)
}

function filesCancel() {
  filesForUpload.value = []
  filesWithErrors.value = []
}

function openFilelistModal() {
  cropModalVisible.value = true
}

function mediaFromFile(file: File): ExtendedMedia {
  return {
    name: file.name,
    src: '',
    mimeType: file.type as ExtendedMedia['mimeType'],
    progress: 1,
    isUploaded: false,
    error: undefined,
    order: files.value.length,
    file
  }
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
      margin: 0.3em 0
      display: flex
      align-items: center
      padding: 0.8em 0
      border: 1px solid var(--border-color)
      border-radius: var(--border-radius)

      &__preview
        cursor: pointer
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
          cursor: move

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

          &:hover
            --danger: var(--border-color)
</style>
