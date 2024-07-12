<template>
  <div class="statistics-number-card">
    <h1 class="statistics-number-card__value">{{ value }}</h1>
    <p class="statistics-number-card__title">{{ name }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string
  value: number
}

defineProps<Props>()
</script>

<style scoped lang="sass">
.statistics-number-card
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  padding: 20px
  border-radius: var(--border-radius)
  background-color: var(--color-background)
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
  margin-bottom: 1.5em

  &__value
    font-size: 32px
    font-weight: 700
    margin: 0

  &__title
    font-size: 12px
    font-weight: 400
    margin: 0
    color: var(--text-light)
    text-align: center
    height: 3em
</style>
