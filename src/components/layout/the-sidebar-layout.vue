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

  @media screen and (max-width: 768px)
    flex-direction: column

  &__sidebar
    width: 300px
    padding: 1rem
    margin: 1rem
    border-radius: var(--border-radius)
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)

    @media screen and (max-width: 768px)
      width: calc(100% - 2rem)

  &__content
    flex: 1
    padding: 1rem

    @media screen and (max-width: 768px)
      width: 100%
</style>
