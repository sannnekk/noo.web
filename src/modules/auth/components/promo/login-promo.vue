<template>
  <div class="login-promo">
    <div class="login-promo__logo">
      <main-logo />
    </div>

    <h2 class="login-promo__headline">
      <typing-text
        :words="[
          'Ты можешь поступить на бюджет туда, куда хочешь!',
          'Здесь заканчиваются твои проблемы в подготовке!',
          'Ты можешь больше! Ты можешь лучше!'
        ]"
        :speed="50"
      />
    </h2>

    <div class="login-promo__illustration">
      <img
        src="/img/auth-icon-space.svg"
        alt=""
      />
    </div>

    <div class="login-promo__footer">
      <promo-shop-link />
      <promo-support-link />
    </div>
  </div>
</template>

<script setup lang="ts">
import PromoShopLink from './promo-shop-link.vue'
import PromoSupportLink from './promo-support-link.vue'
</script>

<style lang="sass" scoped>
$desktop: 992px

// --block-gap comes from auth-layout, which also uses it for the pane padding,
// so the logo is exactly as far from the top edge as from the headline
.login-promo
  display: flex
  flex-direction: column
  flex: 1
  gap: var(--block-gap)
  text-align: center

  &__logo
    font-size: 0.85rem

    :deep(h1)
      margin: 0

  &__headline
    display: flex
    flex-direction: column
    // Two lines are reserved so the typing animation never moves the
    // illustration, and the text sits at the bottom of that box so the gap
    // below it stays exactly the rhythm above while the second line appears
    justify-content: flex-end
    min-height: 2.5em
    margin: 0
    font-weight: 400
    font-size: clamp(1.2rem, 0.6rem + 2vw, 2.5rem)
    line-height: 1.25

  &__illustration
    img
      display: block
      width: 100%
      height: auto

  &__footer
    display: flex
    flex-direction: column
    align-items: center
    gap: var(--block-gap)
    flex: none

  @media screen and (min-width: $desktop)
    text-align: left

    &__illustration
      // Soaks up the leftover vertical space of the taller desktop pane
      margin: auto 0

    &__logo
      font-size: 1.25rem

    &__headline
      max-width: 20em

    &__footer
      align-items: flex-start
      padding-bottom: 1rem
</style>
