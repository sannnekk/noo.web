<template>
  <div class="google-sheets-view">
    <settings-section>
      <template #title> Интеграции Google Sheets </template>
      <template #content>
        <div class="google-sheets-view__integration-list">
          <div class="google-sheets-view__integration-list__search">
            <search-field
              v-model="bindingsStore.bindingsSearch.pagination.search"
              :is-loading="bindingsStore.bindingsSearch.isListLoading"
            />
          </div>
          <div class="google-sheets-view__integration-list__results">
            <bindings-table
              :is-loading="bindingsStore.bindingsSearch.isListLoading"
              :results="bindingsStore.bindingsSearch.results"
              @delete="bindingsStore.deleteBinding($event)"
              @switch-on-off="bindingsStore.switchBindingOnOff($event)"
              @trigger="bindingsStore.triggerBinding($event)"
            />
          </div>
          <div
            class="google-sheets-view__integration-list__pagination"
            v-if="
              bindingsStore.bindingsSearch.resultsMeta.total >
              (bindingsStore.bindingsSearch.pagination.limit || 5)
            "
          >
            <list-pagination
              :total="bindingsStore.bindingsSearch.resultsMeta.total"
              v-model:page="bindingsStore.bindingsSearch.pagination.page"
              :limit="bindingsStore.bindingsSearch.pagination.limit"
            />
          </div>
        </div>
      </template>
    </settings-section>
    <settings-section>
      <template #title> Добавить интеграцию </template>
      <template #content>
        <create-binding-view
          @create-integration="bindingsStore.saveBinding($event)"
        />
      </template>
    </settings-section>
  </div>
</template>

<script lang="ts" setup>
import CreateBindingView from '../components/google-sheets/create-binding-view.vue'
import BindingsTable from '../components/google-sheets/bindings-table.vue'
import SettingsSection from '../components/settings-section.vue'
import { useGoogleSheetsBindingsStore } from '../stores/google-sheets-bindings'

const bindingsStore = useGoogleSheetsBindingsStore()
</script>

<style lang="sass" scoped>
.google-sheets-view
  &__integration-list
    &__search
      font-size: 0.8em

      :deep()
        .search-field
          &__icon
            font-size: 1em

          &__input
            input
              font-size: 0.9em
</style>
