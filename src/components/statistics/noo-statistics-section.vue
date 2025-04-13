<template>
  <div class="statistics-section">
    <div class="statistics-section__header">
      <h3 class="statistics-section__header__title">
        {{ section.name }}
      </h3>
      <p class="statistics-section__header__description">
        {{ section.description }}
      </p>
    </div>
    <div class="statistics-section__content">
      <div class="statistics-section__content__plots">
        <statistics-plot-card
          v-for="plot in section.plots"
          :key="plot.name"
          :plot="plot"
        />
      </div>
      <div class="statistics-section__content__entries">
        <div class="row">
          <statistics-entry-card
            v-for="entry in section.entries"
            :key="entry.name"
            :entry="entry"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Statistics } from '@/core/data/Statistics'

interface Props {
  section: Statistics['sections'][number]
}

defineProps<Props>()
</script>

<style scoped lang="sass">
.statistics-section
  &__header
    margin-bottom: 1.5em
    margin-top: 1.5em
    padding: 1em
    border-radius: var(--border-radius)
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)

    &__title
      margin: 0
      margin-bottom: 0.5em

    &__description
      margin: 0
      font-size: 0.9em
      color: var(--text-light)
</style>
