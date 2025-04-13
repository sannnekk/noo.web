<template>
  <div
    class="more-widget"
    v-if="visibleItems.length > 0"
  >
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
    hide-on-outside-click
    hide-on-scroll
  >
    <div class="menu">
      <ul class="menu__list">
        <li
          class="menu__list__item"
          v-for="(item, index) in items"
          :key="index"
          @click="onAction(items[index])"
          v-show="typeof item.if === 'undefined' || item.if"
          :data-if="item.if"
        >
          <span class="menu__list__item__icon">
            <inline-icon
              v-if="item.icon"
              :name="item.icon"
              :key="item.icon"
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
import { computed, ref } from 'vue'
import type { IconName } from '../icons/noo-icon.vue'

export interface MenuItem {
  title: string
  action: (selfRef?: MenuItem) => void
  stayOpened?: boolean
  icon?: IconName
  if?: boolean
}

interface Props {
  items: MenuItem[]
}

const props = defineProps<Props>()

const hintVisible = ref(false)
const button = ref<HTMLSpanElement | null>(null)
const currentPosition = ref({ x: 0, y: 0 })

const visibleItems = computed(() =>
  props.items.filter((item) => typeof item.if === 'undefined' || item.if)
)

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
  item.action(item)

  if (!item.stayOpened) {
    hintVisible.value = false
  }
}
</script>

<style scoped lang="sass">
.more-widget
  position: relative

  .more-widget__button
    cursor: pointer
    padding: 0.3em
    border-radius: 50%
    height: 2.2em
    width: 2.2em

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
      margin-top: 0.1em
      font-size: 0.8em
      height: 1.4em
      width: 1.4em

      > *
        height: 100%
        width: 100%

    .menu__list__item__title
      flex: 1
      font-size: 0.8em
      padding-right: 0.4em
      padding-top: 0.2em
</style>
