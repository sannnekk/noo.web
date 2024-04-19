<template>
  <div
    class="theme-toggle-widget"
    v-if="Core.isInitialized()"
    :data-rerenderer="rerenderTrigger"
  >
    <button
      @click="toggleTheme"
      class="theme-toggle-widget__button"
    >
      <inline-icon
        name="moon"
        v-if="Core.Context.Theme === 'dark'"
      />
      <inline-icon
        name="sun"
        v-else
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import { ref } from 'vue'

const rerenderTrigger = ref(false)

function toggleTheme() {
  if (Core.Context.Theme === 'dark') {
    Core.Context.Theme = 'light'
    document.body.classList.remove('theme--dark')
  } else {
    Core.Context.Theme = 'dark'
    document.body.classList.add('theme--dark')
  }
  rerenderTrigger.value = !rerenderTrigger.value
}
</script>

<style scoped lang="sass">
.theme-toggle-widget
  &__button
    padding: 0.2em
    font-size: 1.6rem
    display: flex
    justify-content: center
    align-items: center
    border-radius: 0.5em
    background-color: transparent
    cursor: pointer
    border: none

    &:hover
      background-color: var(--light)
</style>
