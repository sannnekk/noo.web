<template>
  <div class="statistics-plot-card">
    <div class="statistics-plot-card__title">
      <h3>{{ plot.name }}</h3>
    </div>
    <div
      class="statistics-plot-card__plot"
      v-if="plot.data.length"
    >
      <line-chart :plot="plot" />
    </div>
    <div
      class="statistics-plot-card__no-data"
      v-else
    >
      <p>Нет данных для отображения</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plot } from '@/core/data/Statistics'

interface Props {
  plot: Plot
}

const props = defineProps<Props>()
</script>

<style scoped lang="sass">
.statistics-plot-card
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  padding: 1em
  border-radius: var(--border-radius)
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
  margin-bottom: 1.5em

  &__title
    font-size: 18px
    font-weight: 700
    margin: 0

  &__plot
    margin-top: 1em
    width: 100%
    height: 350px
    padding: 1em
    padding-top: 0

  &__no-data
    display: flex
    justify-content: center
    align-items: center
    height: 300px
    font-size: 20px
    color: var(--text-light)
</style>
