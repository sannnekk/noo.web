<template>
  <div class="more-widget">
    <div
      class="more-widget__button"
      @click="toggleMenu()"
      ref="button"
    >
      <inline-icon name="more" />
    </div>
  </div>
  <overlay-hint
    v-model:visible="hintVisible"
    :position="currentPosition"
  >
    <div class="menu">
      <ul class="menu__list">
        <li
          class="menu__list__item"
          v-for="item in items"
          :key="item.title"
          @click="onAction(item)"
          v-show="item.if"
        >
          <span class="menu__list__item__icon">
            <inline-icon
              v-if="item.icon"
              :name="item.icon"
            />
          </span>
          <span class="menu__list__item__title">
            {{ item.title }}
          </span>
        </li>
      </ul>
    </div>
  </overlay-hint>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IconName } from '../decorations/inline-icon.vue'

interface MenuItem {
  title: string
  icon?: IconName
  action: () => void
  if?: boolean
}

interface Props {
  items: MenuItem[]
}

defineProps<Props>()

const hintVisible = ref(false)
const button = ref<HTMLSpanElement | null>(null)
const currentPosition = ref({ x: 0, y: 0 })

function getButtonPosition() {
  if (button.value) {
    const { x, y, height } = button.value.getBoundingClientRect()
    currentPosition.value = { x: x, y: y + height }
  }
}

function toggleMenu() {
  getButtonPosition()
  hintVisible.value = !hintVisible.value
}

function onAction(item: MenuItem) {
  item.action()
  hintVisible.value = false
}
</script>

<style scoped lang="sass">
.more-widget
  position: relative

  .more-widget__button
    cursor: pointer
    padding: 0.3em
    border-radius: 50%
    height: 2.1em
    width: 2.1em

    &:hover
      background-color: rgba(0, 0, 0, 0.1)

    .icon
      font-size: 1.5em
      color: var(--color-text)

.menu
  .menu__list
    list-style: none
    padding: 0
    margin: 0
    margin-right: 1.2em

  .menu__list__item
    display: flex
    align-items: center
    padding: 0.2em 0.4em
    cursor: pointer
    border-radius: var(--border-radius)

    &:hover
      background-color: rgba(0, 0, 0, 0.1)

    .menu__list__item__icon
      margin-right: 0.5em
      margin-left: 0.3em
      margin-top: 0.2em
      font-size: 1.1em

    .menu__list__item__title
      flex: 1
      font-size: 0.8em
      padding-right: 0.4em
</style>
