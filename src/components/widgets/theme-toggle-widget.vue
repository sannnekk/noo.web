<template>
  <div
    class="theme-toggle-widget"
    v-if="Core.isInitialized()"
    :data-rerenderer="rerenderTrigger"
  >
    <button
      @click="toggleTheme"
      class="theme-toggle-widget__button"
      title="Сменить тему"
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
import { onMounted, ref } from 'vue'

const rerenderTrigger = ref(false)

function toggleTheme() {
  if (Core.Context.Theme === 'dark') {
    Core.Context.Theme = 'light'
    setTheme('light')
  } else {
    Core.Context.Theme = 'dark'
    setTheme('dark')
  }
  rerenderTrigger.value = !rerenderTrigger.value
}

function setTheme(theme: 'dark' | 'light') {
  if (theme === 'dark') {
    document.body.classList.add('theme--dark')
  } else {
    document.body.classList.remove('theme--dark')
  }
}

onMounted(() => {
  setTheme(Core.Context.Theme)
})
</script>

<style scoped lang="sass">
.theme-toggle-widget
  position: relative

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

    @media screen and (max-width: 768px)
      font-size: 1.4rem
      padding: 0.3em

    &:hover
      background-color: var(--light)
</style>
