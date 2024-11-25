<template>
  <header class="header">
    <google-translate-warner />
    <div class="header__inner">
      <div class="header__pane-toggler">
        <the-pane-toggler />
      </div>
      <div class="header__page-title">
        <h1>{{ route.name }}</h1>
      </div>
      <div class="header__help">
        <div class="header__help__hotkey-widget">
          <hotkey-widget />
        </div>
        <div class="header__help__theme-toggle-widget">
          <theme-toggle-widget />
        </div>
        <div class="header__help__notifications-widget">
          <notifications-widget />
        </div>
        <!-- <div class="header__help__theme-toggle-widget">
          <help-widget />
        </div> -->
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
  padding-top: 1em

  &__inner
    box-shadow: 0px 0px 10px #00000011
    background-color: var(--lightest)
    border-radius: var(--border-radius)
    padding: 0.5em 1em
    width: 100%
    overflow: hidden

    display: grid
    grid-template-columns: auto minmax(0, 1fr) auto auto
    grid-template-rows: 1fr
    align-items: center

    @media screen and (max-width: 768px)
      grid-template-columns: 40px minmax(0, 1fr) auto
      grid-template-rows: auto auto

  &__pane-toggler
    font-size: 60px
    margin-right: 0em
    height: 1em
    min-width: 70px
    width: 70px
    overflow: hidden

    @media screen and (max-width: 768px)
      font-size: 40px

  &__page-title
    h1
      margin: 0
      padding: 0
      white-space: nowrap
      text-overflow: ellipsis
      overflow: hidden

      @media screen and (max-width: 768px)
        margin-left: 0.4em
        font-size: 20px

  &__help
    display: flex
    justify-content: flex-end
    align-items: center
    margin: 0 1em
    gap: 0.4em

    @media screen and (max-width: 768px)
      margin: 0
      padding-left: 0.5em

    &__hotkey-widget
      @media screen and (max-width: 768px)
        display: none

  &__profile-widget
    @media screen and (max-width: 768px)
      grid-column: 1 / -1
      width: 100%
      border-top: 1px solid var(--border-color)
      padding-top: 0.5em
      margin-top: 0.5em
</style>
