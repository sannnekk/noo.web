<template>
  <div class="file-list">
    <div class="file-list__header">
      <div class="file-list__header__label">
        <span>{{ label }}</span>
      </div>
    </div>
    <div class="file-list__body">
      <div class="file-list__body__list">
        <file-card
          v-for="(file, index) in filesModel"
          :key="index"
          :src="file.src"
          :extension="file.extension"
          :file="file.file"
          :name="(file as any).name || file.fileName"
          :actions="actions"
          :selected="!!(selectable && file.key && file.key === selectedKey)"
          :downloadable="actions && actions.includes('download')"
          @click="onFileSelect(file.key)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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

type Action = 'delete' | 'download'

interface Props {
  label?: string
  files: FileItem[]
  actions?: Action[]
  selectable?: boolean
  selectedKey?: string
}

interface Emits {
  (e: 'update:files', value: Props['files']): void
  (e: 'update:selectedKey', value: Props['selectedKey']): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const filesModel = computed({
  get: () => props.files,
  set: (value) => emits('update:files', value)
})

const selectedKeyModel = computed({
  get: () => props.selectedKey,
  set: (value) => emits('update:selectedKey', value)
})

function onFileSelect(key: string) {
  selectedKeyModel.value = key
}
</script>

<style scoped lang="sass">
.file-list
  display: flex
  flex-direction: column

  &__body
    display: flex
    flex-direction: column
    width: 100%
    height: 100%
    padding: 10px

    &__list
      display: grid
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr))
      grid-gap: 10px
      width: 100%
      height: 100%
</style>
