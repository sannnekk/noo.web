<template>
  <div class="success-block">
    <div class="success-block__icon">
      <inline-icon name="check-green" />
    </div>
    <div class="success-block__text">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="sass">
.success-block
  display: flex
  align-items: center
  padding: 1em
  border-radius: var(--border-radius)
  background-color: var(--lightest)
  color: var(--success)
  border: 1px solid var(--success)

  &__icon
    font-size: 40px
    line-height: 10px

  &__text
    padding-left: 1em
</style>
