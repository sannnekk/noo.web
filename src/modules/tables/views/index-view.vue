<template>
  <div class="index-view">
    <div class="index-view__search">
      <div class="index-view__search__input">
        <search-field
          v-model="tableStore.search.pagination.search"
          :is-loading="tableStore.search.isListLoading"
        />
      </div>
      <div class="index-view__search__actions">
        <common-button to="/tables/create"> Создать таблицу </common-button>
      </div>
    </div>
    <div class="index-view__list">
      <entity-table
        :data="tableStore.search.results"
        :is-loading="tableStore.search.isListLoading"
        :cols="cols"
      />
    </div>
    <div class="index-view__pagination">
      <list-pagination
        v-model:page="tableStore.search.pagination.page"
        :limit="tableStore.search.pagination.limit"
        :total="tableStore.search.resultsMeta.total"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ColType } from '@/components/structures/entity-table/entity-table.vue'
import { useTableStore } from '../stores/table'
import { Core } from '@/core/Core'

const tableStore = useTableStore()

tableStore.search.trigger()

const cols: ColType[] = [
  {
    title: 'Название',
    type: 'text',
    value: (item) => item.title
  },
  {
    title: 'Дата изменения',
    type: 'date',
    value: (item) => item.updatedAt
  },
  {
    title: 'Дата создания',
    type: 'date',
    value: (item) => item.createdAt
  },
  {
    title: '',
    type: 'button',
    value: () =>
      Core.Context.roleIs(['teacher'])
        ? 'Посмотреть/редактировать'
        : 'Посмотреть',
    linkTo: (item) => `/tables/create${item.id}`
  }
]
</script>

<style lang="sass" scoped>
.index-view
	padding: 1em

	&__search
		display: flex
		justify-content: space-between
		gap: 1em

		&__input
			flex: 1

		&__actions
			padding-top: 0.1em
</style>
