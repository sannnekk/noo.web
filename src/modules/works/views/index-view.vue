<template>
  <div class="index-works-view">
    <div class="index-works-view__header">
      <div class="index-works-view__header__search">
        <search-field v-model="worksStore.search" />
      </div>
      <div class="index-works-view__header__link">
        <common-button
          to="/create-work"
          design="secondary"
        >
          Создать работу
        </common-button>
      </div>
    </div>
    <div class="index-works-view__table">
      <works-table
        :works="worksStore.works"
        :get-user-action-function="worksStore.getUserAction"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import worksTable from '../components/works-table.vue'
import { useWorksStore } from '../stores/works'

const worksStore = useWorksStore()
</script>

<style lang="sass" scoped>
.index-works-view
  &__header
    padding: 1rem
    display: flex
    gap: 1rem

    &__search
      flex: 1

    &__link
      margin-top: 0.15rem
</style>
