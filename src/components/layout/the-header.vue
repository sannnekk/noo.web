<template>
  <header class="header">
    <div class="header__inner">
      <div class="header__pane-toggler">
        <the-pane-toggler />
      </div>
      <div class="header__logo">
        <h1>{{ route.name }}</h1>
      </div>
      <div class="header__profile-widget">
        <profile-widget />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped lang="sass">
.header
  &__inner
    box-shadow: 0px 0px 10px #00000011
    margin-top: 1em
    display: flex
    align-items: center
    background-color: var(--lightest)
    border-radius: var(--border-radius)
    padding: 0.5em 1em

    @media screen and (max-width: 768px)
      flex-wrap: wrap
      justify-content: flex-start

  &__pane-toggler
    font-size: 60px
    margin-right: 0em
    height: 1em
    max-width: 2em
    overflow: hidden

    @media screen and (max-width: 768px)
      font-size: 40px

  &__logo

    @media screen and (min-width: 768px)
      flex: 1

    h1
      margin: 0
      padding: 0

      @media screen and (max-width: 768px)
        margin-left: 0.4em
        font-size: 20px

  &__profile-widget
    @media screen and (max-width: 768px)
      width: 100%
      border-top: 1px solid var(--border-color)
      padding-top: 0.5em
      margin-top: 0.5em
</style>
