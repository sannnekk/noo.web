<template>
  <div
    class="results-view"
    v-if="resultsStore.poll"
  >
    <div class="results-view__head">
      <router-link
        to="/blog"
        class="results-view__head__back"
      >
        Назад к блогу
      </router-link>
      <h1>{{ resultsStore.poll.title }}</h1>
    </div>
    <tabs-view :titles="['Зарегистрированные', 'Не зарегистрированные']">
      <template #tab-0>
        <div class="results-view__search-input">
          <search-field
            v-model="resultsStore.resultsSearch.pagination.search"
          />
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
      </template>
      <template #tab-1>
        <div class="results-view__search-input">
          <search-field
            v-model="resultsStore.unregisteredResultsSearch.pagination.search"
          />
        </div>
        <div class="results-view__results">
          <unregistered-results-table
            :results="resultsStore.unregisteredResultsSearch.results"
            :is-loading="resultsStore.unregisteredResultsSearch.isListLoading"
            :poll-id="resultsStore.poll.id"
          />
        </div>
        <div class="results-view__pagination">
          <list-pagination
            v-model:page="
              resultsStore.unregisteredResultsSearch.pagination.page
            "
            :limit="resultsStore.unregisteredResultsSearch.pagination.limit"
            :total="resultsStore.unregisteredResultsSearch.resultsMeta.total"
          />
        </div>
      </template>
    </tabs-view>
  </div>
</template>

<script setup lang="ts">
import unregisteredResultsTable from '../components/unregistered-results-table.vue'
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
