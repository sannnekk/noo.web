<template>
  <div class="info-block">
    <div class="info-block__icon">
      <inline-icon name="info" />
    </div>
    <div class="info-block__text">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="sass">
.info-block
  display: flex
  align-items: center
  padding: 1em
  border-radius: var(--border-radius)
  background-color: var(--lightest)
  color: var(--info)
  border: 1px solid var(--info)

  &__icon
    font-size: 40px
    line-height: 10px

  &__text
    padding-left: 1em
</style>
