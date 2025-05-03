<template>
  <div class="index-works-view">
    <tabs-view
      :titles="[
        'Все',
        'Нерешенные',
        'Непроверенные',
        'Проверенные',
        'Архивированные',
        // TODO: refactor
        '[new]Карточки заданий'
      ]"
      v-model:tab-index="assignedWorksStore.currentTabIndex"
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
        <div class="index-works-view__filters">
          <search-filters
            v-model:pagination="assignedWorksStore.allSearch.pagination"
            :filters="allSearchFilters"
            :is-loading="assignedWorksStore.allSearch.isListLoading"
          />
        </div>
        <div class="index-works-view__selected-actions">
          <actions-with-selected
            :selected-assigned-works="assignedWorksStore.allSearchSelectedWorks"
            @delete="assignedWorksStore.deleteWorks($event)"
            @send-to-revision="assignedWorksStore.sendWorksToRevision($event)"
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
      <template #tab-5>
        <favourite-task-view />
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
import favouriteTaskView from '../components/favourite-task/favourite-task-view.vue'
import type { SearchFilter } from '@/components/search/filters/SearchFilter'
import { subjectFilter } from '@/components/search/filters/filter-types/subject-filter'

const assignedWorksStore = useAssignedWorksStore()

setPageTitle('Мои работы')

const allSearchFilters: SearchFilter[] = [
  {
    name: 'Тип работы',
    type: 'arr',
    key: 'work.type',
    arrayOptions: [
      { label: 'Тест', value: 'test' },
      { label: 'Мини-зачет', value: 'mini-test' },
      { label: 'Вторая часть', value: 'second-part' },
      { label: 'Пробник', value: 'trial-work' },
      { label: 'Фраза', value: 'phrase' }
    ]
  },
  subjectFilter('work')
]
</script>

<style lang="sass" scoped>
.index-works-view
  &__filters
    padding: 1em

  &__header
    padding: 1rem
    display: flex
    gap: 1rem

    &__search
      flex: 1

    &__link
      margin-top: 0.15rem
</style>
