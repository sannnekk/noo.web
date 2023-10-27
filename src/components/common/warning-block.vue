<template>
  <div class="warning-block">
    <div class="warning-block__icon">
      <inline-icon name="attention-yellow" />
    </div>
    <div class="warning-block__text">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="sass">
.warning-block
  display: flex
  align-items: center
  padding: 1em
  border-radius: var(--border-radius)
  background-color: var(--lightest)
  color: var(--warning)
  border: 1px solid var(--warning)

  &__icon
    font-size: 40px
    line-height: 10px

  &__text
    padding-left: 1em
</style>
