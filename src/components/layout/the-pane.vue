<template>
  <div
    class="pane"
    v-auto-animate
    :class="{ open: globalStore._isPaneOpen }"
  >
    <div class="pane__inner">
      <div class="pane__logo">
        <logo />
      </div>
      <div class="pane__nav">
        <nav>
          <ul>
            <li
              class="pane__nav__entry"
              v-for="(navEntry, index) in globalStore.navEntries"
              :key="navEntry.route"
            >
              <router-link
                :to="navEntry.route"
                @click="globalStore.setPaneOpen(false)"
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
          Нашел ошибку в работе платформы?
          <br />
          Сообщи через Telegram-бота @noo.support
        </p>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <div
      v-if="globalStore._isPaneOpen"
      v-auto-animate
      class="overlay"
      @click="globalStore.setPaneOpen(false)"
    ></div>
  </Teleport>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/store'
import logo from '../common/logo.vue'
import { ref, watch } from 'vue'

const globalStore = useGlobalStore()

const isOnHover = ref(globalStore.navEntries.map(() => false))
const isOpening = ref(globalStore.navEntries.map(() => false))

const animationDelay = 300
const animationStep = 100
const animationDuration = 200

watch(
  () => globalStore._isPaneOpen,
  () => {
    if (globalStore._isPaneOpen) {
      globalStore.navEntries.forEach((_, index) => {
        setTimeout(() => {
          isOnHover.value[index] = true
          isOpening.value[index] = true
        }, animationDelay + index * animationStep)
        setTimeout(() => {
          isOnHover.value[index] = false
        }, animationDelay + index * animationStep + animationDuration)
      })
    } else {
      isOpening.value = globalStore.navEntries.map(() => false)
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
    padding: 45px 5px
    text-align: center

  &__nav
    flex: 1

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
</style>
