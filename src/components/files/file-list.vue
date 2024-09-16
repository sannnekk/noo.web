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
          v-for="(mediaItem, index) in mediaModel"
          :key="index"
          :src="mediaItem.src"
          :extension="getExtension(mediaItem.mimeType)"
          :file="(mediaItem as ExtendedMedia).file"
          :name="(mediaItem as any).name || mediaItem.name"
          :actions="actions"
          :selected="!!(selectable && mediaItem.name === selectedModel?.name)"
          :downloadable="actions && actions.includes('download')"
          @click="onFileSelect(mediaItem)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ExtendedMedia } from './file-input.vue'
import type { Media } from '@/core/data/entities/Media'

type Action = 'delete' | 'download'

interface Props {
  label?: string
  files: (ExtendedMedia | Media)[]
  actions?: Action[]
  selectable?: boolean
  selected?: ExtendedMedia | Media
}

interface Emits {
  (e: 'update:files', value: Props['files']): void
  (e: 'update:selected', value: Props['selected']): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const mediaModel = computed({
  get: () => props.files,
  set: (value) => emits('update:files', value)
})

const selectedModel = computed({
  get: () => props.files.find((file) => file.name === props.selected?.name),
  set: (value) => emits('update:selected', value)
})

function onFileSelect(current: Media | ExtendedMedia) {
  selectedModel.value = current
}

function getExtension(mimeType: string) {
  return (mimeType?.split('/')?.at(1) || 'pdf') as 'png' | 'jpeg' | 'pdf'
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
