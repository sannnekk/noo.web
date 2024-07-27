<template>
  <div class="index-works-view">
    <tabs-view
      :titles="[
        'Все',
        'Не решенные',
        'Не проверенные',
        'Проверенные',
        'Архивированные'
      ]"
      @tab-change="assignedWorksStore.changeTab($event)"
    >
      <template #tab-0>
        <!-- All assigned works -->
        <div class="index-works-view__header">
          <div class="index-works-view__header__search">
            <search-field
              v-model="assignedWorksStore.allSearch.pagination.search"
              :is-loading="assignedWorksStore.allSearch.isListLoading"
            />
          </div>
        </div>
        <div class="index-works-view__selected-actions">
          <actions-with-selected
            :selected-assigned-works="assignedWorksStore.allSearchSelectedWorks"
          />
        </div>
        <div class="index-works-view__table">
          <works-table
            :works="assignedWorksStore.allSearch.results"
            :loading="assignedWorksStore.allSearch.isListLoading"
            @select="assignedWorksStore.allSearchChecklist = $event"
            editable
          />
        </div>
        <div class="index-works-view__pagination">
          <list-pagination
            v-model:page="assignedWorksStore.allSearch.pagination.page"
            :total="assignedWorksStore.allSearch.resultsMeta.total"
            :limit="assignedWorksStore.allSearch.pagination.limit"
          />
        </div>
      </template>
      <template #tab-1>
        <!-- Not solved assigned works -->
        <div class="index-works-view__header">
          <div class="index-works-view__header__search">
            <search-field
              v-model="assignedWorksStore.notSolvedSearch.pagination.search"
              :is-loading="assignedWorksStore.notSolvedSearch.isListLoading"
            />
          </div>
        </div>
        <div class="index-works-view__table">
          <works-table
            :works="assignedWorksStore.notSolvedSearch.results"
            :loading="assignedWorksStore.notSolvedSearch.isListLoading"
          />
        </div>
        <div class="index-works-view__pagination">
          <list-pagination
            v-model:page="assignedWorksStore.notSolvedSearch.pagination.page"
            :total="assignedWorksStore.notSolvedSearch.resultsMeta.total"
            :limit="assignedWorksStore.notSolvedSearch.pagination.limit"
          />
        </div>
      </template>
      <template #tab-2>
        <!-- Not checked assigned works -->
        <div class="index-works-view__header">
          <div class="index-works-view__header__search">
            <search-field
              v-model="assignedWorksStore.notCheckedSearch.pagination.search"
              :is-loading="assignedWorksStore.notCheckedSearch.isListLoading"
            />
          </div>
        </div>
        <div class="index-works-view__table">
          <works-table
            :works="assignedWorksStore.notCheckedSearch.results"
            :loading="assignedWorksStore.notCheckedSearch.isListLoading"
          />
        </div>
        <div class="index-works-view__pagination">
          <list-pagination
            v-model:page="assignedWorksStore.notCheckedSearch.pagination.page"
            :total="assignedWorksStore.notCheckedSearch.resultsMeta.total"
            :limit="assignedWorksStore.notCheckedSearch.pagination.limit"
          />
        </div>
      </template>
      <template #tab-3>
        <!-- checked assigned works -->
        <div class="index-works-view__header">
          <div class="index-works-view__header__search">
            <search-field
              v-model="assignedWorksStore.checkedSearch.pagination.search"
              :is-loading="assignedWorksStore.checkedSearch.isListLoading"
            />
          </div>
        </div>
        <div class="index-works-view__table">
          <works-table
            :works="assignedWorksStore.checkedSearch.results"
            :loading="assignedWorksStore.checkedSearch.isListLoading"
          />
        </div>
        <div class="index-works-view__pagination">
          <list-pagination
            v-model:page="assignedWorksStore.checkedSearch.pagination.page"
            :total="assignedWorksStore.checkedSearch.resultsMeta.total"
            :limit="assignedWorksStore.checkedSearch.pagination.limit"
          />
        </div>
      </template>
      <template #tab-4>
        <!-- archived assigned works -->
        <div class="index-works-view__header">
          <div class="index-works-view__header__search">
            <search-field
              v-model="assignedWorksStore.archivedSearch.pagination.search"
              :is-loading="assignedWorksStore.archivedSearch.isListLoading"
            />
          </div>
        </div>
        <div class="index-works-view__selected-actions">
          <actions-with-archived-selected
            :selected-assigned-works="
              assignedWorksStore.archivedSearchSelectedWorks
            "
          />
        </div>
        <div class="index-works-view__table">
          <works-table
            :works="assignedWorksStore.archivedSearch.results"
            :loading="assignedWorksStore.archivedSearch.isListLoading"
            @select="assignedWorksStore.archivedSearchChecklist = $event"
            editable
          />
        </div>
        <div class="index-works-view__pagination">
          <list-pagination
            v-model:page="assignedWorksStore.archivedSearch.pagination.page"
            :total="assignedWorksStore.archivedSearch.resultsMeta.total"
            :limit="assignedWorksStore.archivedSearch.pagination.limit"
          />
        </div>
      </template>
    </tabs-view>
  </div>
</template>

<script setup lang="ts">
import { setPageTitle } from '@/core/utils/setPageTitle'
import { useAssignedWorksStore } from '../stores/assigned-works'
import worksTable from '../components/works-table.vue'
import actionsWithSelected from '../components/actions-with-selected.vue'
import actionsWithArchivedSelected from '../components/actions-with-archived-selected.vue'

const assignedWorksStore = useAssignedWorksStore()

setPageTitle('Мои работы')
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
