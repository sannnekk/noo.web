<template>
  <component
    :is="downloadable ? 'a' : 'div'"
    :href="downloadable ? downloadLink : undefined"
    :download="downloadable ? src : undefined"
    target="_blank"
    class="file-card"
    :class="{
      'file-card--selected': selected,
      'file-card--downloadable': downloadable
    }"
  >
    <div class="file-card__preview">
      <inline-icon
        v-if="extension === 'pdf' || src.split('.').pop() === 'pdf'"
        name="pdf-file"
      />
      <uploaded-image
        v-else
        :src="src || file"
      />
    </div>
    <div class="file-card__label">
      <span>{{ fileName || src }}</span>
    </div>
  </component>
</template>

<script setup lang="ts">
import type { FileItem } from '@/types/composed/FileItem'
import { computed } from 'vue'

interface Props extends FileItem {
  selected?: boolean
  downloadable?: boolean
}

const props = defineProps<Props>()

const downloadLink = computed(() =>
  props.src ? `https://cdn.noo-school.ru/uploads/${props.src}` : undefined
)

function getImage(): string {
  return props.isUploaded ? props.src : getBlob(props.file)
}

function getBlob(file: File | null): string {
  return file ? URL.createObjectURL(file) : 'a'
}
</script>

<style scoped lang="sass">
.file-card
  text-decoration: none
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  width: 100%
  height: 100%
  padding: 10px
  border-radius: 5px
  background-color: #fff
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
  border: 3px dashed transparent
  cursor: pointer

  &--selected
    border-color: var(--secondary)

  &--downloadable
    &:hover


  &:hover
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2)

  &__preview
    display: flex
    align-items: center
    justify-content: center
    width: 100%
    height: 100%
    margin-bottom: 10px
    font-size: 3.5em
    aspect-ratio: 1
    overflow: hidden

    img
      width: 100%
      height: 100%
      object-fit: contain

  &__label
    display: flex
    align-items: center
    justify-content: center
    width: 100%
    font-size: 12px
    color: #000
    text-align: center
    word-break: break-all
</style>