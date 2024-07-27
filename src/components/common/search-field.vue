<template>
  <div
    class="search-field"
    @mouseenter="isOnHover = true"
    @mouseleave="isOnHover = false"
  >
    <loader-icon
      class="search-field__icon"
      v-if="isLoading"
      contrast
    />
    <inline-icon
      v-else
      class="search-field__icon"
      name="search"
      :animation="isOnHover"
    />
    <text-input
      placeholder="Поиск"
      class="search-field__input"
      type="text"
      v-model="model"
      :autocomplete="false"
    />
    <inline-icon
      v-show="model && model.length"
      name="cross-red"
      class="search-field__empty-button"
      @click="model = ''"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue?: string
  isLoading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value?: string): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue || '',
  set: (value) => emits('update:modelValue', value)
})

const isOnHover = ref(false)
</script>

<style scoped lang="sass">
.search-field
  position: relative

  @media screen and (max-width: 768px)
    font-size: 12px

  &__icon
    position: absolute
    top: 50%
    left: 0.8rem
    transform: translateY(-50%)
    transition: transform 0.2s ease-in-out
    font-size: 30px

    @media screen and (max-width: 768px)
      font-size: 22px

  &__input:deep()

    input
      font-size: 16px
      padding: 0.75em 1em 0.75em 3em !important
      padding-left: 4em !important
      border-color: var(--border-color) !important
      color: var(--form-text-color)

      @media screen and (max-width: 768px)
        font-size: 12px

  &__empty-button
    position: absolute
    top: 50%
    right: 0.25em
    transform: translateY(-50%)
    font-size: 2em
    cursor: pointer
    color: var(--text-light)
    transition: transform 0.2s ease-in-out

    &:hover
      transform: translateY(-50%) rotate(90deg)
</style>
