<template>
  <div
    class="search-field"
    @mouseenter="isOnHover = true"
    @mouseleave="isOnHover = false"
  >
    <inline-icon
      class="search-field__icon"
      name="search"
      :animation="isOnHover"
    />
    <text-input
      placeholder="Поиск"
      class="search-field__input"
      type="text"
      v-model="model"
    />
    <common-button class="search-field__button"> Поиск </common-button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})

const isOnHover = ref(false)
</script>

<style scoped lang="sass">
.search-field
  position: relative

  &__icon
    position: absolute
    top: 50%
    left: 0.8rem
    transform: translateY(-50%)
    transition: transform 0.2s ease-in-out
    font-size: 30px

  &__input:deep()

    input
      font-size: 16px
      padding: 0.75em 1em 0.75em 3em !important
      padding-left: 4em !important

  &__button
    width: 100px
    position: absolute
    top: 50%
    right: 0.4em
    transform: translateY(-50%)
    font-size: 1em
</style>
