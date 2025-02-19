<template>
  <div class="my-polls-view">
    <div class="my-polls-view__search">
      <search-field
        v-model="myPollSearch.pagination.value.search"
        :is-list-loading="myPollSearch.isListLoading.value"
      />
    </div>
    <div class="my-polls-view__results">
      <entity-table
        :cols="columns"
        :data="myPollSearch.results.value"
        :is-loading="myPollSearch.isListLoading.value"
      />
    </div>
    <div class="my-polls-view__pagination">
      <list-pagination
        v-model:page="myPollSearch.pagination.value.page"
        :total="myPollSearch.resultsMeta.value.total"
        :limit="myPollSearch.pagination.value.limit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ColType } from '@/components/structures/entity-table/entity-table.vue'
import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'

const pollService = Core.Services.Poll
const uiService = Core.Services.UI

const myPollSearch = useSearch(fetchMyPolls)

async function fetchMyPolls(pagination?: Pagination) {
  try {
    return await pollService.getMyPolls(pagination)
  } catch (error: any) {
    uiService.openErrorModal('Ошибка при загрузке опросов', error.message)
  }
}

const columns: ColType[] = [
  {
    title: 'Название',
    type: 'text',
    value: (poll) => poll.title
  },
  /* {
    title: 'Количество проголосовавших',
    type: 'text',
    value: (poll) => poll.votedCount
  }, */
  {
    title: '',
    type: 'button',
    alignment: 'right',
    value: () => 'Посмотреть',
    linkTo: (poll) => `/polls/${poll.id}/results/${Core.Context.User?.username}`
  }
]
</script>

<style lang="sass" scoped>
.my-polls-view
	padding-top: 1em

	&__search
		:deep()
			input
				font-size: 0.8em
</style>
