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
      <span>{{ name || src }}</span>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  selected?: boolean
  downloadable?: boolean
  key: string
  id?: string
  name: string
  src: string
  extension: 'png' | 'jpeg' | 'pdf'
  progress: number
  isUploaded: boolean
  error: string
  file: File | null
}

const props = defineProps<Props>()

const downloadLink = computed(() =>
  props.src ? `https://cdn.noo-school.ru/uploads/${props.src}` : undefined
)
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
  background-color: var(--light)
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
  border: 3px dashed transparent
  cursor: pointer
  max-height: 200px

  &--selected
    border-color: var(--secondary)

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
    aspect-ratio: 1 / 1
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
    color: var(--form-text-color)
    text-align: center
    word-break: break-all
</style>
