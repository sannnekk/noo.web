<template>
  <div class="index-view">
    <div class="index-view__search">
      <div class="index-view__search__input">
        <search-field
          v-model="pollsStore.pollSearch.pagination.search"
          :is-loading="pollsStore.pollSearch.isListLoading"
        />
      </div>
      <div class="index-view__search__actions">
        <common-button to="/polls/create-poll">Создать опрос</common-button>
      </div>
    </div>
    <div class="index-view__results">
      <entity-table
        :is-loading="pollsStore.pollSearch.isListLoading"
        :data="pollsStore.pollSearch.results"
        :cols="columns"
        :actions="actions"
      />
    </div>
    <div class="index-view__pagination">
      <list-pagination
        v-model:page="pollsStore.pollSearch.pagination.page"
        :limit="pollsStore.pollSearch.pagination.limit"
        :total="pollsStore.pollSearch.resultsMeta.total"
      />
    </div>
  </div>
  <sure-delete-modal
    v-model:visible="deletePollModal.isVisible"
    @confirm="pollsStore.deletePoll(deletePollModal.poll!.id)"
  >
    <template #title> Удаление опроса </template>
    <template #text>
      Вы уверены, что хотите удалить опрос "{{ deletePollModal.poll?.title }}"?
    </template>
  </sure-delete-modal>
</template>

<script setup lang="ts">
import type { ColType } from '@/components/structures/entity-table/entity-table.vue'
import { usePollsStore } from '../stores/polls'
import type { Poll } from '@/core/data/entities/Poll'
import type { MenuItem } from '@/components/widgets/noo-more-widget.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const pollsStore = usePollsStore()
const router = useRouter()

const deletePollModal = ref({
  poll: null as Poll | null,
  isVisible: false
})

const columns: ColType[] = [
  {
    title: 'Название',
    type: 'text',
    value: (poll: Poll) => poll.title,
    linkTo: (poll: Poll) => `/polls/${poll.id}/results`
  },
  {
    title: 'Количество проголосовавших',
    type: 'text',
    value: (poll: Poll) => poll.votedCount
  },
  {
    title: 'Требуется авторизация',
    type: 'text',
    value: (poll: Poll) =>
      poll.requireAuth
        ? '<span style="color:var(--success)">Да</span>'
        : '<span style="color:var(--danger)">Нет</span>'
  },
  {
    title: 'Дата создания',
    type: 'date',
    value: (poll: Poll) => poll.createdAt
  }
]

function actions(poll: Poll): MenuItem[] {
  return [
    {
      title: 'Результаты',
      icon: 'user',
      action: () => router.push(`/polls/${poll.id}/results`)
    },
    {
      title: 'Редактировать',
      icon: 'edit',
      action: () => router.push(`/polls/create-poll${poll.id}`)
    },
    {
      title: 'Удалить',
      icon: 'delete',
      action: () => {
        deletePollModal.value.poll = poll
        deletePollModal.value.isVisible = true
      }
    }
  ]
}
</script>

<style scoped lang="sass">
.index-view
	&__search
		padding: 1em
		display: flex
		gap: 1em

		&__input
			flex: 1
</style>
