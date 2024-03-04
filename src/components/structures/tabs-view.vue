<template>
  <div class="tabs-view">
    <div class="tabs-view__titles">
      <div
        class="tabs-view__titles__title"
        :class="{ active: titles.indexOf(title) === activeTabIndex }"
        v-for="(title, index) in titles"
        :key="`${title}-title`"
        @click="activeTabIndex = index"
      >
        {{ title }}
      </div>
    </div>
    <div class="tabs-view__tabs">
      <div
        class="tabs-view__tabs__tab"
        v-for="(title, index) in titles"
        :key="`${title}-tab`"
        v-show="titles.indexOf(title) === activeTabIndex"
      >
        <slot :name="`tab-${index}`"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  titles: string[]
}

defineProps<Props>()

const activeTabIndex = ref(0)
</script>

<style scoped lang="sass">
.tabs-view
  &__titles
    padding-top: 1em
    display: flex
    justify-content: center
    gap: 2em

    @media (max-width: 768px)
      flex-direction: column
      justify-content: center
      gap: 0.5em

    &__title
      padding: 10px
      cursor: pointer
      color: var(--text-light)

      &:hover
        color: var(--dark)

      &.active
        color: var(--lila)
        font-weight: bold
</style>
