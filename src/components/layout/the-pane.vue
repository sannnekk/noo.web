<template>
  <div
    class="pane"
    v-auto-animate
    :class="{ open: uiStore.isPaneOpen }"
  >
    <div class="pane__inner">
      <div class="pane__logo">
        <main-logo />
      </div>
      <div class="pane__nav">
        <nav>
          <ul>
            <li
              class="pane__nav__entry"
              v-for="(navEntry, index) in navEntries"
              :key="navEntry.route"
            >
              <router-link
                :to="navEntry.route"
                @click="uiService.setPaneOpen(false)"
                @mouseenter="isOnHover[index] = true"
                @mouseleave="isOnHover[index] = false"
              >
                <inline-icon
                  class="pane__nav__entry__icon"
                  :class="{
                    'pane__nav__entry__icon--opened': isOpening[index]
                  }"
                  :name="navEntry.icon"
                  :animation="isOnHover[index]"
                />
                <span class="pane__nav__entry__title">
                  {{ navEntry.title }}</span
                >
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
      <div class="pane__help">
        <p>
          Есть проблема? Напишите нам в
          <a
            href="https://t.me/+oACQzPflwZQ1ODRi"
            target="_blank"
          >
            @noo_support_chat
          </a>
        </p>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <div
      v-if="uiStore.isPaneOpen"
      v-auto-animate
      class="overlay"
      @click="uiService.setPaneOpen(false)"
    ></div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Core } from '@/core/Core'

const uiService = Core.Services.UI
const uiStore = uiService.Store()

const navEntries = ref(uiService.getNavEntries())

const isOnHover = ref(navEntries.value.map(() => false))
const isOpening = ref(navEntries.value.map(() => false))

const animationDelay = 300
const animationStep = 100
const animationDuration = 200

watch(
  () => uiStore.isPaneOpen,
  () => {
    if (uiStore.isPaneOpen) {
      navEntries.value.forEach((_, index) => {
        setTimeout(() => {
          isOnHover.value[index] = true
          isOpening.value[index] = true
        }, animationDelay + index * animationStep)
        setTimeout(() => {
          isOnHover.value[index] = false
        }, animationDelay + index * animationStep + animationDuration)
      })
    } else {
      isOpening.value = navEntries.value.map(() => false)
    }
  }
)
</script>

<style scoped lang="sass">
.overlay
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: #00000088
  z-index: 999998
  cursor: pointer

.pane
  position: fixed
  left: -350px
  top: 0
  z-index: 999999
  width: min(90%, 350px)
  height: 100%
  background-color: var(--lightest)
  transition: left 0.3s ease-in-out

  &.open
    left: 0

  &__inner
    display: flex
    flex-direction: column
    height: 100%

  &__logo
    padding: 30px 5px
    text-align: center

    @media screen and (max-width: 768px)
      :deep()
        h1
          font-size: 1.3rem

  &__nav
    flex: 1
    max-height: 90%
    overflow-y: auto

    nav
      ul
        list-style: none
        padding: 0
        margin: 0

    &__entry
      font-size: 17px
      width: 100%

      a
        text-decoration: none
        color: inherit
        display: flex
        align-items: center
        padding: 0.7em 0

        @media screen and (max-width: 768px)
          padding-top: 0.5em
          padding-bottom: 0.5em
          font-size: 15px

        &.router-link-active
          background-color: var(--lightest)
          font-weight: bold

      &__icon
        font-size: 42px
        margin: 0 30px
        transition: transform 0.2s ease-in-out
        transform: scale(0)
        opacity: 0

        &--opened
          opacity: 1
          transform: scale(1)

      &:hover
        background-color: var(--lightest)

  &__help
    padding: 0 15px 15px 15px
    text-align: center
    font-size: 14px
    color: var(--text-light)

    a
      color: var(--lila)
      font-weight: bold
      text-decoration: none

      &:hover
        text-decoration: underline
</style>
