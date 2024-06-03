<template>
  <div
    class="results-view"
    v-if="resultsStore.poll"
  >
    <div class="results-view__head">
      <router-link
        to="/blog"
        class="results-view__head__back"
        >Назад к блогу</router-link
      >
      <h1>{{ resultsStore.poll.title }}</h1>
    </div>
    <div class="results-view__search-input">
      <search-field v-model="resultsStore.resultsSearch.pagination.search" />
    </div>
    <div class="results-view__results">
      <results-table
        :results="resultsStore.resultsSearch.results"
        :is-loading="resultsStore.resultsSearch.isListLoading"
        :poll-id="resultsStore.poll.id"
      />
    </div>
    <div class="results-view__pagination">
      <list-pagination
        v-model:page="resultsStore.resultsSearch.pagination.page"
        :limit="resultsStore.resultsSearch.pagination.limit"
        :total="resultsStore.resultsSearch.resultsMeta.total"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import resultsTable from '../components/results-table.vue'
import { usePollResultsStore } from '../stores/results'

const resultsStore = usePollResultsStore()

resultsStore.fetchPoll()
</script>

<style scoped lang="sass">
.results-view
  padding: 1em

  &__head
    &__back
      text-decoration: none
      color: var(--text-light)

      &:hover
        text-decoration: underline
</style>
