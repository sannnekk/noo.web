<template>
  <div class="index-works-view">
    <div class="index-works-view__header">
      <div class="index-works-view__header__search">
        <search-field
          v-model="worksStore.pagination.search"
          :is-loading="worksStore.isListLoading"
        />
      </div>
      <div class="index-works-view__header__link">
        <common-button to="/create-work/new">Создать работу</common-button>
      </div>
    </div>
    <div class="index-works-view__table">
      <works-table
        :works="worksStore.results"
        :loading="worksStore.isListLoading"
      />
    </div>
    <div class="index-works-view__pagination">
      <list-pagination
        v-model:page="worksStore.pagination.page"
        :total="worksStore.resultsMeta.total"
        :limit="worksStore.pagination.limit"
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
  padding: 1rem

  &__header
    padding-bottom: 1rem
    display: flex
    gap: 1rem

    @media screen and (max-width: 768px)
      flex-direction: column

    &__search
      flex: 1

      @media screen and (max-width: 768px)
        margin-bottom: 1rem
        width: 100%

    &__link
      @media screen and (min-width: 768px)
        margin-top: 0.15rem

      @media screen and (max-width: 768px)
        font-size: 12px
</style>
