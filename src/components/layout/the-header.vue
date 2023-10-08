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

  &__pane-toggler
    font-size: 60px
    margin-right: 0em
    height: 1em

  &__logo
    flex: 1

    h1
      margin: 0
      padding: 0
</style>
