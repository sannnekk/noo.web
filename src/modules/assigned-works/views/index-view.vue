<template>
  <div class="index-works-view">
    <div class="index-works-view__header">
      <div class="index-works-view__header__search">
        <search-field
          v-model="assignedWorksStore.pagination.search"
          :is-loading="assignedWorksStore.isListLoading"
        />
      </div>
    </div>
    <div class="index-works-view__table">
      <works-table
        :works="assignedWorksStore.results"
        :loading="assignedWorksStore.isListLoading"
        :get-user-action-function="assignedWorksStore.getUserAction"
      />
    </div>
    <div class="index-works-view__pagination">
      <list-pagination
        v-model:page="assignedWorksStore.pagination.page"
        :total="assignedWorksStore.resultsMeta.total"
        :limit="assignedWorksStore.pagination.limit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import worksTable from '../components/works-table.vue'
import { useAssignedWorksStore } from '../stores/assigned-works'

const assignedWorksStore = useAssignedWorksStore()
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
