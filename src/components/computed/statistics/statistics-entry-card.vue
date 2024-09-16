<template>
  <div
    class="statistics-entry-card"
    :class="colLayout"
  >
    <div class="statistics-entry-card__inner">
      <h1 class="statistics-entry-card__value">
        <span class="statistics-entry-card__value__main">
          {{ beautifyNumber(entry.value) }}
        </span>
        <span
          class="statistics-entry-card__value__percentage"
          v-if="entry.percentage"
        >
          {{ entry.percentage }}%
        </span>
      </h1>
      <p class="statistics-entry-card__title">{{ entry.name }}</p>
      <div class="statistics-entry-card__sub-entries">
        <div
          class="statistics-entry-card__sub-entries__item"
          v-for="subEntry in entry.subEntries"
          :key="subEntry.name"
        >
          <h4 class="statistics-entry-card__sub-entries__item__value">
            <span class="statistics-entry-card__sub-entries__item__value__main">
              {{ beautifyNumber(subEntry.value) }}
            </span>
            <span
              class="statistics-entry-card__sub-entries__item__value__percentage"
              v-if="subEntry.percentage"
            >
              {{ subEntry.percentage }}%
            </span>
          </h4>
          <p class="statistics-entry-card__sub-entries__item__name">
            {{ subEntry.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Statistics } from '@/core/data/Statistics'
import { computed } from 'vue'

interface Props {
  entry: Statistics['sections'][number]['entries'][number]
}

const props = defineProps<Props>()

const colLayout = computed(() => {
  return props.entry.subEntries?.length
    ? 'col-12 col-md-12 col-lg-6'
    : 'col-6 col-md-4 col-lg-3'
})

function beautifyNumber(value: number): string {
  return value.toLocaleString('ru-RU')
}
</script>

<style scoped lang="sass">
.statistics-entry-card
  margin-bottom: 1em

  &__inner
    margin: 0.15em
    padding: 1em
    border-radius: var(--border-radius)
    background-color: var(--color-background)
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)

  &__value
    font-size: 2em
    font-weight: 700
    margin: 0

  &__title
    font-size: 0.8em
    font-weight: 400
    margin: 0
    color: var(--text-light)

  &__sub-entries
    margin-top: 1em
    display: flex
    gap: 0.8em

    &__item
      &__value
        font-size: 1em
        font-weight: 700
        margin: 0

        &__percentage
          font-weight: 400
          margin-left: 0.5em
          color: var(--text-light)

      &__name
        font-size: 0.8em
        font-weight: 400
        margin: 0
        color: var(--text-light)
</style>
