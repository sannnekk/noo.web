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
        <common-button to="/create-work">Создать работу</common-button>
      </div>
    </div>
    <div class="index-works-view__filters">
      <search-filters
        :filters="filters"
        v-model:pagination="worksStore.pagination"
      />
    </div>
    <div class="index-works-view__table">
      <works-table
        :works="worksStore.results"
        :loading="worksStore.isListLoading"
        @copy-work="worksStore.copyWork($event)"
        @delete-work="onWorkDelete($event)"
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
  <sure-modal
    v-model:visible="deleteWorkModal.visible"
    @confirm="worksStore.deleteWork(deleteWorkModal.workId)"
  >
    <template #title> Удаление работы </template>
    <template #text>
      Вы уверены, что хотите удалить работу <br />
      <b>
        {{
          worksStore.results.find((work) => work.id === deleteWorkModal.workId)
            ?.name
        }}
      </b>
      ?
      <br />
      <br />
      <warning-block>
        Все, кто решал/проверял эту работу, больше не смогут её открыть.
        Сохранится только статус, дедлайн и общий балл.
      </warning-block>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import { setPageTitle } from '@/core/utils/setPageTitle'
import { useWorksStore } from '../stores/works'
import worksTable from '../components/works-table.vue'
import { reactive, ref } from 'vue'
import type { SearchFilter } from '@/components/search/filters/SearchFilter'
import { subjectFilter } from '@/core/filters/subject-filter'

setPageTitle('Работы')

const worksStore = useWorksStore()

const deleteWorkModal = reactive({
  visible: false,
  workId: ''
})

function onWorkDelete(workId: string) {
  deleteWorkModal.workId = workId
  deleteWorkModal.visible = true
}

const filters = ref<SearchFilter[]>([
  {
    name: 'Тип',
    type: 'arr',
    key: 'type',
    arrayOptions: [
      { label: 'Тест', value: 'test' },
      { label: 'Мини-зачет', value: 'mini-test' },
      { label: 'Вторая часть', value: 'second-part' },
      { label: 'Пробник', value: 'trial-work' },
      { label: 'Фраза', value: 'phrase' }
    ]
  },
  {
    name: 'Дата создания',
    type: 'range',
    key: 'createdAt',
    rangeType: 'date',
    rangeValues: [new Date(), new Date()]
  },
  subjectFilter
])
</script>

<style lang="sass" scoped>
.index-works-view
  &__header
    padding-bottom: 1rem
    display: flex
    gap: 1rem
    padding: 1rem

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

  &__filters
    padding: 0 1em
</style>
