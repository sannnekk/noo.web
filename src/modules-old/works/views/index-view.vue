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
        @show-related-materials="onShowRelatedMaterials($event)"
        @show-work-statistics="onShowWorkStatistics($event)"
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
  <sure-delete-modal
    v-model:visible="deleteWorkModalData.visible"
    @confirm="worksStore.deleteWork(deleteWorkModalData.work)"
  >
    <template #title> Удаление работы </template>
    <template #text>
      Вы уверены, что хотите удалить работу <br />
      <b>
        {{ deleteWorkModalData.work?.name }}
      </b>
      ?
      <br />
      <br />
      <warning-block>
        Все, кто решал/проверял эту работу, больше не смогут её открыть.
        Сохранится только статус, дедлайн и общий балл.
      </warning-block>
    </template>
  </sure-delete-modal>
  <related-materials-modal
    v-model:visible="relatedMaterialsModalData.visible"
    :work="relatedMaterialsModalData.work"
  />
  <work-statistics-modal
    v-model:visible="workStatisticsModalData.visible"
    :work="workStatisticsModalData.work"
  />
</template>

<script setup lang="ts">
import workStatisticsModal from '../components/work-statistics-modal.vue'
import relatedMaterialsModal from '../components/related-materials-modal.vue'
import { setPageTitle } from '@/core/utils/setPageTitle'
import { useWorksStore } from '../stores/works'
import worksTable from '../components/works-table.vue'
import { reactive, ref } from 'vue'
import type { SearchFilter } from '@/components/search/filters/SearchFilter'
import { subjectFilter } from '@/components/search/filters/filter-types/subject-filter'
import type { Work } from '@/core/data/entities/Work'
import { workTypeFilter } from '@/components/search/filters/filter-types/work-type-filter'

setPageTitle('Работы')

const worksStore = useWorksStore()

const deleteWorkModalData = reactive({
  visible: false,
  work: null as Work | null
})

const relatedMaterialsModalData = reactive({
  visible: false,
  work: null as Work | null
})

const workStatisticsModalData = reactive({
  visible: false,
  work: null as Work | null
})

function onWorkDelete(work: Work) {
  deleteWorkModalData.work = work
  deleteWorkModalData.visible = true
}

function onShowRelatedMaterials(work: Work) {
  relatedMaterialsModalData.work = work
  relatedMaterialsModalData.visible = true
}

function onShowWorkStatistics(work: Work) {
  workStatisticsModalData.work = work
  workStatisticsModalData.visible = true
}

const filters = ref<SearchFilter[]>([
  workTypeFilter(),
  {
    name: 'Дата создания',
    type: 'range',
    key: 'createdAt',
    rangeType: 'date',
    rangeValues: [new Date(), new Date()]
  },
  subjectFilter()
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
