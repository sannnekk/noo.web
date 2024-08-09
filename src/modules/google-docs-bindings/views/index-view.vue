<template>
  <div class="index-view">
    <div class="index-view__search">
      <div class="index-view__search__input">
        <search-field
          v-model="bindingStore.bindingsSearch.pagination.search"
          :is-loading="bindingStore.bindingsSearch.isListLoading"
        />
      </div>
      <div class="index-view__search__buttons">
        <common-button
          to="/google-docs-bindings/create"
          design="primary"
        >
          Создать интеграцию
        </common-button>
      </div>
    </div>
    <div class="index-view__results">
      <bindings-table
        :results="bindingStore.bindingsSearch.results"
        :is-loading="bindingStore.bindingsSearch.isListLoading"
        @delete="bindingStore.deleteBinding($event)"
        @trigger="bindingStore.triggerBinding($event)"
        @switch-on-off="bindingStore.switchBindingOnOff($event)"
        @show-error="showError($event)"
      />
    </div>
    <div class="index-view__pagination">
      <list-pagination
        v-model:page="bindingStore.bindingsSearch.pagination.page"
        :total="bindingStore.bindingsSearch.resultsMeta.total"
        :limit="bindingStore.bindingsSearch.pagination.limit"
      />
    </div>
  </div>
  <base-modal
    v-model:visible="errorModal.visible"
    :title="`Ошибка интеграции ${errorModal.name}`"
    :message="errorModal.error"
    type="error"
  />
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import bindingsTable from '../components/bindings-table.vue'
import { useGoogleDocsBindingsStore } from '../stores/google-docs-bindings'

const bindingStore = useGoogleDocsBindingsStore()

const errorModal = reactive({
  name: '',
  error: '',
  visible: false
})

function showError(bindingId: string) {
  const binding = bindingStore.bindingsSearch.results.find(
    (binding) => binding.id === bindingId
  )!

  errorModal.name = binding.name
  errorModal.error = binding.lastErrorText || 'Неизвестная ошибка'
  errorModal.visible = true
}
</script>

<style scoped lang="sass">
.index-view
  &__search
    padding: 1em
    display: flex
    gap: 1em
    margin-bottom: 1em

    @media screen and (max-width: 768px)
      flex-direction: column

    &__input
      flex: 1

      @media screen and (max-width: 768px)
        margin-bottom: 1em

    &__buttons
      padding-top: 2px

      @media screen and (max-width: 768px)
        margin-bottom: 1em
        font-size: 12px
</style>
