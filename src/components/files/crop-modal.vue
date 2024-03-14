<template>
  <teleport to="body">
    <div
      class="crop-modal"
      v-if="visible"
    >
      <div class="crop-modal__inner">
        <div class="crop-modal__preview">
          <div
            class="crop-modal__preview__image-preview"
            v-if="currentImage && showCroppper"
          >
            <cropper
              class="crop-modal__preview__image-preview__cropper"
              :src="currentImage"
              @change="onCropChange($event)"
            />
            <div class="crop-modal__preview__image-preview__actions">
              <common-button
                alignment="stretch"
                design="secondary"
                @click="onImageCrop()"
              >
                Обрезать
              </common-button>
            </div>
          </div>
          <div
            class="crop-modal__preview__pdf-preview"
            v-else-if="currentFileItem?.extension === 'pdf'"
          >
            <pdf-preview :src="createObjectUrl(currentFileItem.file!)" />
          </div>
        </div>
        <div class="crop-modal__menu">
          <div class="crop-modal__menu__header">
            <h3>Файлы</h3>
          </div>
          <div class="crop-modal__menu__file-list">
            <file-list
              v-model:files="filesModel"
              v-model:selected-key="selectedFileKey"
            />
          </div>
          <div class="crop-modal__menu__actions">
            <div class="row">
              <div class="col">
                <common-button
                  @click="onFilesCancel()"
                  design="danger"
                  alignment="stretch"
                >
                  Отмена
                </common-button>
              </div>
              <div class="col">
                <common-button
                  @click="onFilesConfirm()"
                  design="primary"
                  alignment="stretch"
                >
                  Загрузить
                </common-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

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

interface Props {
  visible: boolean
  files: FileItem[]
}

interface Emits {
  (e: 'update:visible', value: Props['visible']): void
  (e: 'update:files', value: Props['files']): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const filesModel = computed({
  get: () => props.files,
  set: (value) => emits('update:files', value)
})

const selectedFileKey = ref('')

const currentFileItem = ref<FileItem>()
const currentImage = ref<string>('')

const showCroppper = computed(() => {
  return currentFileItem.value?.extension !== 'pdf'
})
const cropperCurrentCanvas = ref<HTMLCanvasElement>()

watch(
  props.files,
  () => {
    selectedFileKey.value = props.files[0]?.key || ''
  },
  { immediate: true }
)

watch(
  selectedFileKey,
  () => {
    currentFileItem.value = filesModel.value.find(
      (file) => file.key === selectedFileKey.value
    )

    if (currentFileItem.value) getBase64Image(currentFileItem.value)
  },
  { immediate: true }
)

function onCropChange({ canvas }: { canvas: HTMLCanvasElement }) {
  cropperCurrentCanvas.value = canvas
}

function onImageCrop() {
  if (!currentFileItem.value) return
  if (!cropperCurrentCanvas.value) return

  const file = dataURLtoFile(
    cropperCurrentCanvas.value.toDataURL(),
    currentFileItem.value.fileName
  )

  filesModel.value = filesModel.value.map((fileItem) => {
    if (fileItem.key === currentFileItem.value?.key) {
      return {
        ...fileItem,
        file
      }
    }

    return fileItem
  })
}

function dataURLtoFile(dataurl: string, filename: string) {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}

function getBase64Image(file: FileItem) {
  if (!file.file) {
    currentImage.value = ''
    return
  }

  currentImage.value = ''

  const reader = new FileReader()

  reader.readAsDataURL(file.file)
  reader.onload = () => {
    currentImage.value = reader.result as string
  }
}

function createObjectUrl(file: File) {
  return URL.createObjectURL(file)
}

function onFilesConfirm() {
  emits('confirm')
}

function onFilesCancel() {
  emits('update:visible', false)
  emits('cancel')
}
</script>

<style scoped lang="sass">
.crop-modal
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 500
  background-color: rgba(0, 0, 0, 0.5)
  display: flex
  justify-content: center
  align-items: center

  &__inner
    background-color: var(--lightest)
    border-radius: var(--border-radius)
    height: 90vh
    overflow-y: hidden
    width: min(1110px, 100%)
    display: flex

  &__preview
    width: 100%
    height: 100%
    overflow: hidden
    flex: 1

    &__image-preview
      height: 90vh
      position: relative
      display: flex
      align-items: center
      justify-content: center
      background-color: var(--border-color)

      &__cropper
        z-index: 1

        &:deep() .vue-advanced-cropper__background, .vue-advanced-cropper__foreground
          background-color: var(--dark)
          opacity: 1

      &__actions
        position: absolute
        bottom: 1.1em
        right: 1em
        z-index: 2

    &__pdf-preview
      width: 100%
      height: 100%

      > *
        width: 100%
        height: 100%

  &__menu
    display: flex
    flex-direction: column
    gap: 1em
    height: 90vh
    width: min(350px, 100%)
    padding: 1em

    &__header
      padding-top: 1em
      height: 3.5em
      border-bottom: 1px solid var(--border-color)

      h3
        font-size: 1.2em
        color: var(--dark)
        margin-top: 0

    &__file-list
      flex: 1
      overflow-y: auto

    &__actions
      height: 2.5em
</style>
