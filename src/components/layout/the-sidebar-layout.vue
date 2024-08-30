<template>
  <div class="sidebar-layout">
    <div
      class="sidebar-layout__sidebar"
      v-auto-animate
    >
      <div class="sidebar-layout__sidebar__hide">
        <span
          v-if="sidebarOpened"
          @click="sidebarOpened = false"
        >
          Скрыть
        </span>
        <span
          v-else
          @click="sidebarOpened = true"
        >
          Открыть
        </span>
      </div>
      <slot
        name="sidebar"
        v-if="sidebarOpened"
      ></slot>
    </div>
    <div class="sidebar-layout__content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const sidebarOpened = ref(true)

function handleResize() {
  if (window.innerWidth > 768) {
    sidebarOpened.value = true
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="sass">
.sidebar-layout
  display: flex
  flex-direction: row

  @media screen and (max-width: 768px)
    flex-direction: column

  &__sidebar
    width: 300px
    height: fit-content
    padding: 1rem
    margin: 1rem
    border-radius: var(--border-radius)
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)

    @media screen and (max-width: 768px)
      width: calc(100% - 2rem)

    &__hide
      display: none
      padding: 0
      text-align: right
      cursor: pointer
      color: var(--text-light)
      font-size: 0.8em

      &:hover
        color: var(--info)

      @media screen and (max-width: 768px)
        display: block

  &__content
    flex: 1
    padding: 1rem
    width: calc(100% - 300px)

    @media screen and (max-width: 768px)
      width: 100%
</style>
