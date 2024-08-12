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
            v-else-if="selectedMedia?.mimeType === 'application/pdf'"
          >
            <pdf-preview :src="createObjectUrl(selectedMedia.file!)" />
          </div>
        </div>
        <div class="crop-modal__menu">
          <div class="crop-modal__menu__header">
            <h3>Файлы</h3>
          </div>
          <div class="crop-modal__menu__file-list">
            <file-list
              selectable
              v-model:files="filesModel"
              v-model:selected="selectedMedia"
            />
          </div>
          <div class="crop-modal__menu__error-list">
            <p
              class="crop-modal__menu__error-list__error"
              v-for="file in filesWithErrors"
              :key="file.order"
            >
              <b> {{ file.name }}: </b>
              <span>
                {{ file.error }}
              </span>
            </p>
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
import type { ExtendedMedia } from './file-input.vue'
import { computed, ref, watch } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

interface Props {
  visible: boolean
  files: ExtendedMedia[]
  filesWithErrors: ExtendedMedia[]
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

const selectedMedia = ref<ExtendedMedia>()
const currentImage = ref<string>('')

const showCroppper = computed(() => {
  return (
    selectedMedia.value?.mimeType === 'image/jpeg' ||
    selectedMedia.value?.mimeType === 'image/png'
  )
})
const cropperCurrentCanvas = ref<HTMLCanvasElement>()

// select the first one when opened
watch(
  () => props.visible,
  () => {
    selectedMedia.value = props.files?.at(0)
  },
  { immediate: true }
)

watch(
  selectedMedia,
  () => {
    if (selectedMedia.value) {
      setTimeout(() => setBase64Image(selectedMedia.value!), 25)
    }
  },
  { immediate: true }
)

function onCropChange({ canvas }: { canvas: HTMLCanvasElement }) {
  cropperCurrentCanvas.value = canvas
}

function onImageCrop() {
  if (!selectedMedia.value) return
  if (!cropperCurrentCanvas.value) return

  const file = dataURLtoFile(
    cropperCurrentCanvas.value.toDataURL(),
    selectedMedia.value.name
  )

  filesModel.value = filesModel.value.map((fileItem) => {
    if (fileItem.name === selectedMedia.value?.name) {
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

function setBase64Image(file: ExtendedMedia) {
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
  filesModel.value = []
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
  z-index: 2000
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

    @media only screen and (max-width: 768px)
      flex-direction: column

  &__preview
    width: 100%
    height: 100%
    overflow: hidden
    flex: 1

    @media only screen and (max-width: 768px)
      height: 45vh

    &__image-preview
      height: 90vh
      position: relative
      display: flex
      align-items: center
      justify-content: center
      background-color: var(--border-color)

      @media only screen and (max-width: 768px)
        height: 42vh

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

    @media only screen and (max-width: 768px)
      height: auto
      width: 100%
      overflow-x: auto

    &__header
      padding-top: 1em
      height: 3.5em
      border-bottom: 1px solid var(--border-color)

      h3
        font-size: 1.2em
        color: var(--form-text-color)
        margin-top: 0

    &__file-list
      flex: 1
      overflow-y: auto
      width: auto

      :deep()
        .file-list__body__list
          @media only screen and (max-width: 768px)
            display: flex
            width: unset

          .file-card
            @media only screen and (max-width: 768px)
              min-width: 130px
              max-width: 130px

    &__error-list
      font-size: 0.7em
      margin: 0
      display: none

      &__error
        margin: 0

        span
          color: var(--danger)

    &__actions
      height: 2.5em
</style>
