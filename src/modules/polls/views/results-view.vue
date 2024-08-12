<template>
  <div
    class="results-view"
    v-if="resultsStore.poll"
  >
    <div class="results-view__head">
      <back-button to="/blog"> Назад к блогу</back-button>
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
            :results="resultsStore.resultsSearch.results as any[]"
            :is-loading="resultsStore.resultsSearch.isListLoading"
            :poll-id="resultsStore.poll.id"
          />
        </div>
        <div
          class="results-view__pagination"
          v-if="
            resultsStore.resultsSearch.pagination.page &&
            resultsStore.resultsSearch.pagination.limit &&
            resultsStore.resultsSearch.resultsMeta.total
          "
        >
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
        <div
          class="results-view__pagination"
          v-if="
            resultsStore.unregisteredResultsSearch.pagination.page &&
            resultsStore.unregisteredResultsSearch.pagination.limit &&
            resultsStore.unregisteredResultsSearch.resultsMeta.total
          "
        >
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
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const resultsStore = usePollResultsStore()
const route = useRoute()

watch(
  () => route.params.pollId,
  () => {
    resultsStore.fetchPoll()
  },
  { immediate: true }
)
</script>

<style scoped lang="sass">
.results-view
  padding: 1em
</style>
