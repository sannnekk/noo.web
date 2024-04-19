<template>
  <div class="beta-tag">
    <span class="beta-tag__text">Beta</span>
  </div>
</template>

<style scoped lang="sass">
.beta-tag
  background-color: var(--warning)
  border-radius: var(--border-radius)
  font-weight: normal
  display: inline-block
  font-size: 0.5em
  padding: 0.1em 0.5em

  &__text
    text-transform: uppercase
    font-weight: bold
    color: var(--lightest)
</style>
