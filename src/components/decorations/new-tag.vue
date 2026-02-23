<template>
  <div class="new-tag">
    <span class="new-tag__text">New</span>
  </div>
</template>

<style scoped lang="sass">
.new-tag
  background-color: var(--danger)
  border-radius: var(--border-radius)
  font-weight: normal
  display: inline-block
  font-size: 0.5em
  padding: 0.1em 0.5em
  vertical-align: middle

  &__text
    text-transform: uppercase
    font-weight: bold
    color: var(--lightest)
</style>
