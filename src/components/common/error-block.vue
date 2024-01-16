<template>
  <div class="error-block">
    <div class="error-block__icon">
      <inline-icon name="cross-red" />
    </div>
    <div class="error-block__text">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="sass">
.error-block
  display: flex
  align-items: center
  padding: 1em
  border-radius: var(--border-radius)
  background-color: var(--lightest)
  color: var(--danger)
  border: 1px solid var(--danger)

  &__icon
    font-size: 40px
    line-height: 10px

  &__text
    padding-left: 1em
</style>
