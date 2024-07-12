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
        <text-format-icon
          v-if="item.type !== 'color'"
          :name="item.icon"
        />
        <span
          class="quill-toolbar__button__color-dot"
          :style="{ 'background-color': item.value }"
          v-else
        >
        </span>
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

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped lang="sass">
.quill-toolbar
  display: flex
  align-items: center
  background-color: var(--form-background)
  border-bottom: 1px solid var(--border-color)
  border-top-left-radius: var(--border-radius)
  border-top-right-radius: var(--border-radius)
  overflow-y: hidden
  overflow-x: auto
  // remove scrollbar
  scrollbar-width: none

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
    width: 1.8rem
    height: 2rem

    &--active
      background-color: var(--border-color)
      color: var(--form-text-color)

    &:hover
      background-color: var(--lila)

    &__color-dot
      width: 0.8rem
      height: 0.8rem
      border-radius: 50%
      display: inline-block
      margin: 0 0.1rem
      border: 1px solid var(--border-color)
</style>
