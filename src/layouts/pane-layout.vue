<template>
  <div class="pane-layout">
    <div class="pane-layout__pane">
      <the-pane />
    </div>
    <div class="container">
      <div class="pane-layout__content">
        <div class="pane-layout__header">
          <the-header />
        </div>
        <div class="pane-layout__slot">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.pane-layout
  &__slot
    background-color: var(--lightest)
    border-radius: var(--border-radius)
    min-height: 50vh
    margin-top: 1em
    box-shadow: 0px 0px 10px #00000011
</style>
