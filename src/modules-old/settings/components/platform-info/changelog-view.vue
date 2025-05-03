<template>
  <div class="changelog-view">
    <div
      class="changelog-view__item"
      v-for="item in changelog"
      :key="item.version"
    >
      <div class="changelog-view__item__version">Версия {{ item.version }}</div>
      <div class="changelog-view__item__date">Дата релиза: {{ item.date }}</div>
      <div class="changelog-view__item__changes">
        <ul>
          <li
            v-for="(change, index) in item.changes"
            :key="index"
          >
            <b :class="change.type">
              {{ typeToString(change.type) }}
            </b>
            -
            <span>{{ change.description }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChangelogItem } from '@/core/data/system/Changelog'

interface Props {
  changelog: ChangelogItem[]
}

defineProps<Props>()

function typeToString(type: ChangelogItem['changes'][0]['type']): string {
  switch (type) {
    case 'build':
      return 'BUILD'
    case 'feat':
      return 'FEATURE'
    case 'fix':
      return 'FIX'
    case 'impr':
      return 'IMPROVEMENT'
    case 'refc':
      return 'REFACTOR'
    case 'test':
      return 'TEST'
    default:
      return 'UNKNOWN'
  }
}
</script>

<style scoped lang="sass">
.changelog-view
  &__item
    margin-bottom: 1em
    padding: 0.3em 1em
    border-left: 3px solid var(--border-color)

    &__version
      font-size: 1.2em
      margin-bottom: 5px

    &__date
      font-size: 0.8em
      color: #666

    &__changes
      ul
        list-style: none
        padding: 0

        li
          margin-bottom: 0.1em
          color: var(--text-light)

          b
            margin-right: 5px
            font-weight: bold

            &.fix
              color: var(--info)

            &.impr
              color: var(--lila)

            &.test
              color: var(--danger)

            &.build
              color: var(--warning)

            &.refc
              color: var(--text-light)

            &.feat
              color: var(--success)
</style>
