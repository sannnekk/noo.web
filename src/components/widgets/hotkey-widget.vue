<template>
  <div
    class="hotkey-widget"
    v-if="hotkeys.length > 0"
  >
    <div
      class="hotkey-widget__button"
      @click="toggleHint()"
      ref="button"
    >
      <inline-icon name="keyboard" />
    </div>
  </div>
  <overlay-hint
    v-model:visible="hintVisible"
    :position="currentPosition"
  >
    <div class="hint">
      <h3 class="hint__title">Горячие клавиши</h3>
      <ul class="hint__list">
        <li
          class="hint__list__item"
          v-for="(hotkey, index) in hotkeys"
          :key="index"
        >
          <span class="hint__list__item__keys">
            <kbd
              v-for="(key, index) in hotkey.keys"
              :key="index"
            >
              {{ getKey(key) }}
            </kbd>
          </span>
          <span class="hint__list__item__description">{{
            hotkey.description
          }}</span>
        </li>
      </ul>
    </div>
  </overlay-hint>
</template>

<script setup lang="ts">
import { getRegisteredHotkeys } from '@/core/device/Hotkeys'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const hotkeys = ref(getRegisteredHotkeys())
const hintVisible = ref(false)
const button = ref<HTMLSpanElement | null>(null)
const currentPosition = ref({ x: 0, y: 0 })

watch(
  () => route.fullPath,
  () => {
    setTimeout(() => {
      hotkeys.value = getRegisteredHotkeys()
    }, 100)
  },
  { immediate: true }
)

function getButtonPosition() {
  if (button.value) {
    const { x, y, height } = button.value.getBoundingClientRect()
    currentPosition.value = { x: x, y: y + height }
  }
}

function getKey(key: string) {
  if (key === 'ArrowUp') return '↑'
  if (key === 'ArrowDown') return '↓'
  if (key === 'ArrowLeft') return '←'
  if (key === 'ArrowRight') return '→'
  return key
}

function toggleHint() {
  getButtonPosition()
  hintVisible.value = !hintVisible.value
}
</script>

<style scoped lang="sass">
.hotkey-widget
  user-select: none

  &__button
    padding: 0.2em
    font-size: 1.6rem
    display: flex
    justify-content: center
    align-items: center
    border-radius: 0.5em
    cursor: pointer

    &:hover
      background-color: var(--light)

.hint
  padding: 0.5em

  &__title
    margin: 0
    padding: 0
    font-size: 1.2rem
    margin-bottom: 0.5em

  &__list
    list-style: none
    padding: 0
    margin: 0
    font-size: 0.7em

    &__item
      display: flex
      justify-content: space-between
      align-items: center
      padding: 0.5em 0
      border-bottom: 1px solid var(--lightest)

      &:last-child
        border-bottom: none

      &__keys
        display: flex
        justify-content: flex-start
        align-items: center

        kbd
          background-color: var(--light)
          padding: 0.1em 0.3em
          border-radius: 0.2em
          margin-right: 0.3em

      &__description
        color: var(--text-light)
        margin-left: 1em
</style>
