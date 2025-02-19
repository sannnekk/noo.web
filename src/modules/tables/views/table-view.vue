<template>
  <div
    class="table-view"
    v-if="tableStore.currentTable"
  >
    <div class="table-view__info">
      <div class="table-view__info__back-button">
        <back-button to="/tables">Назад к списку</back-button>
      </div>
      <div class="table-view__info__head">
        <div class="table-view__info__head__title">
          <form-input
            label="Название таблицы"
            v-model="tableStore.currentTable.title"
            type="text"
            :readonly="Core.Context.roleIs(['mentor'])"
          />
        </div>
        <div
          class="table-view__info__head__actions"
          v-if="Core.Context.roleIs(['teacher'])"
        >
          <common-button @click="tableStore.saveTable()"
            >Сохранить</common-button
          >
        </div>
      </div>
    </div>
    <div
      class="table-view__table"
      :key="tableStore.currentTable.id"
    >
      <noo-table
        v-model:data="tableStore.currentTable"
        :editable="Core.Context.roleIs(['teacher'])"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useTableStore } from '../stores/table'
import { useRoute } from 'vue-router'
import { Core } from '@/core/Core'

const route = useRoute()
const tableStore = useTableStore()

watch(
  () => route.params.tableId,
  () => {
    if (route.params.tableId) {
      tableStore.loadTable(route.params.tableId as string)
    }
  },
  { immediate: true }
)
</script>

<style lang="sass" scoped>
.table-view
	&__info
		padding: 1em

		&__back-button
			margin-bottom: 1em

		&__head
			display: flex
			align-items: flex-end
			gap: 1em

			&__title
				flex: 1

	&__table
		max-width: 100%
		overflow-x: auto
		padding-bottom: 1em
</style>
