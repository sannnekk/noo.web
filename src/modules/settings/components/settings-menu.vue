<template>
  <ul class="settings-menu">
    <li
      class="settings-menu__item"
      v-for="entry in navEntries"
      :key="entry.title"
    >
      <router-link
        :to="entry.route"
        class="settings-menu__link"
      >
        <div class="settings-menu__icon">
          <inline-icon :name="entry.icon" />
        </div>
        <div class="settings-menu__text">
          <span class="settings-menu__text__title">{{ entry.title }}</span>
          <span class="settings-menu__text__description">
            {{ entry.description }}
          </span>
        </div>
      </router-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { SettingsNavEntry } from '../types/SettingsNavEntry'

interface Props {
  navEntries: SettingsNavEntry[]
}

defineProps<Props>()
</script>

<style scoped lang="sass">
.settings-menu
  list-style-type: none
  padding: 0
  margin: 0

  &__item
    margin-bottom: 0.2em

  &__link
    display: flex
    align-items: flex-start
    padding: 0.5em 1em
    border-radius: 0.5em
    color: var(--form-text-color)
    text-decoration: none
    transition: background-color 0.2s

    &.router-link-active
      background-color: var(--light)

    &:not(.router-link-active):hover
      background-color: var(--light)

  &__icon
    margin-right: 0.6em
    font-size: 1.8em
    height: 2em
    width: 1em
    display: flex
    align-items: center
    justify-content: center

  &__text
    flex: 1
    font-size: 1em
    display: flex
    flex-direction: column
    justify-content: center

    &__title
      font-weight: bold
      display: block

    &__description
      display: block
      line-height: 1.1em
      font-size: 0.8em
      color: var(--text-light)
</style>
