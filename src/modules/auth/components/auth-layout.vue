<template>
  <div class="auth-layout">
    <section class="auth-layout__promo">
      <slot name="promo" />
    </section>
    <section class="auth-layout__panel">
      <slot />
    </section>
  </div>
</template>

<style lang="sass" scoped>
$desktop: 992px

// The only component that knows about the two-pane geometry.
// Everything inside the panes is laid out in normal flow and just fills
// the width it is given.
.auth-layout
  --auth-link-color: #0059ff
  --auth-gutter: 1.25rem
  // The promo pane's vertical rhythm. It lives here rather than in the promo
  // components because the pane's own top/bottom padding is part of that
  // rhythm: the logo sits exactly as far from the top edge as it does from
  // the headline below it.
  --block-gap: 2rem

  display: flex
  flex-direction: column
  min-height: 100vh
  min-height: 100dvh
  background-color: var(--primary)

  &__promo
    display: flex
    flex-direction: column
    background-color: var(--light)
    padding: var(--block-gap) var(--auth-gutter)

  &__panel
    display: flex
    flex-direction: column
    flex: 1 0 auto
    background-color: var(--primary)
    padding: 2rem var(--auth-gutter)

  // Side by side, each pane scrolling on its own
  @media screen and (min-width: $desktop)
    --auth-gutter: 2.5rem
    --block-gap: 2.5rem

    flex-direction: row
    height: 100vh
    height: 100dvh

    &__promo, &__panel
      height: 100%
      min-height: 0
      overflow-y: auto
      overscroll-behavior: contain
      padding: var(--auth-gutter)

    &__promo
      flex: 1 1 auto
      min-width: 0

    &__panel
      flex: 0 0 clamp(22rem, 34%, 34rem)
</style>
