<template>
  <div class="feature-block">
    <div class="feature-block__icon">
      <inline-icon name="info" />
    </div>
    <div class="feature-block__text">
      Функционал будет доступен в версии {{ version }}
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  version: string
}

defineProps<Props>()
</script>

<style scoped lang="sass">
.feature-block
  display: flex
  align-items: center
  padding: 1em
  border-radius: var(--border-radius)
  background-color: var(--lightest)
  color: var(--lila)
  border: 1px solid var(--lila)

  &__icon
    font-size: 40px
    line-height: 10px

    &:deep()
      svg
        path
          fill: var(--lila) !important
          stroke: var(--lila) !important

  &__text
    padding-left: 1em
</style>
