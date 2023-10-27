<template>
  <div class="sidebar-layout">
    <div class="sidebar-layout__sidebar">
      <slot name="sidebar"></slot>
    </div>
    <div class="sidebar-layout__content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<style scoped lang="sass">
.sidebar-layout
  display: flex
  flex-direction: row

  &__sidebar
    width: 300px
    padding: 1rem
    margin: 1rem
    border-radius: var(--border-radius)
    border: 1px solid var(--border-color)

  &__content
    flex: 1
    padding: 1rem
</style>
