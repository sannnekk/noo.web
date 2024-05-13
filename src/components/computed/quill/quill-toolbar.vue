<template>
  <div
    v-if="visible"
    class="quill-toolbar"
    :id="`__quill_toolbox_${id}`"
  >
    <div
      v-for="(group, index) in toolbar"
      :key="index"
      class="quill-toolbar__group"
    >
      <button
        v-for="item in group"
        :key="item.type"
        class="quill-toolbar__button"
        :class="{
          'quill-toolbar__button--active': item.active
        }"
        @click="() => $emit('format', item)"
        :title="item.title"
      >
        <text-format-icon :name="item.icon" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type FormatType, type Toolbar } from './quill'

interface Props {
  visible: boolean
  toolbar: Toolbar
  id: string
}

interface Emits {
  (
    e: 'format',
    value: {
      type: FormatType
      value: string | number | boolean
      action?: (index: number) => void | Promise<void>
    }
  ): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
</script>

<style scoped lang="sass">
.quill-toolbar
  display: flex
  align-items: center
  background-color: var(--form-background)
  border-bottom: 1px solid var(--border-color)
  border-top-left-radius: var(--border-radius)
  border-top-right-radius: var(--border-radius)
  overflow: hidden

  &__group
    display: flex

    &:not(:first-child)
      border-left: 1px solid var(--border-color)

  &__button
    background-color: transparent
    border: none
    color: var(--form-text-color)
    cursor: pointer
    font-size: 0.7em
    width: 2rem
    height: 2rem

    &--active
      background-color: var(--border-color)
      color: var(--form-text-color)

    &:hover
      background-color: var(--lila)
</style>
