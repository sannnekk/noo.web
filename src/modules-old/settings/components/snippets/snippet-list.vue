<template>
  <div
    class="snippet-list"
    v-if="snippets.length !== 0"
  >
    <div
      class="snippet-list__item"
      v-for="(snippet, index) in snippets"
      :key="snippet.id"
    >
      <div class="snippet-list__item__index">
        <span>{{ index + 1 }}</span>
      </div>
      <div class="snippet-list__item__name">
        <span>{{ snippet.name }}</span>
      </div>
      <div class="snippet-list__item__actions">
        <div
          class="snippet-list__item__actions__edit"
          @click="openEditSnippetModal(snippet)"
        >
          <inline-icon name="edit" />
        </div>
        <div
          class="snippet-list__item__actions__delete"
          @click="openDeleteSnippetModal(snippet)"
        >
          <inline-icon name="delete" />
        </div>
      </div>
    </div>
  </div>
  <div
    class="snippet-list__no-snippets"
    v-else
  >
    <p>
      Сниппеты позволяют сохранить и использовать часто используемые фрагменты
      текста. <br />
      Создайте свой первый сниппет!
    </p>
  </div>
  <sure-modal
    v-model:visible="editSnippetModalData.isOpen"
    @confirm="onUpdate()"
  >
    <template #title>Редактировать сниппет</template>
    <template #text>
      <rich-text-area
        v-if="editSnippetModalData.snippet?.content"
        label="Сниппет"
        v-model="editSnippetModalData.snippet.content"
      />
    </template>
  </sure-modal>
  <sure-modal
    v-model:visible="deleteSnippetModalData.isOpen"
    @confirm="onDelete()"
  >
    <template #title
      >Удалить сниппет "{{ deleteSnippetModalData.snippet?.name }}"</template
    >
    <template #text> Вы уверены, что хотите удалить этот сниппет? </template>
  </sure-modal>
</template>

<script setup lang="ts">
import type { Snippet } from '@/core/data/entities/Snippet'
import { reactive } from 'vue'

interface Props {
  snippets: Snippet[]
}

interface Emits {
  (event: 'update', snippet: Snippet): void
  (event: 'delete', snippet: Snippet): void
}

defineProps<Props>()
const emits = defineEmits<Emits>()

const editSnippetModalData = reactive({
  isOpen: false,
  snippet: null as Snippet | null
})

const deleteSnippetModalData = reactive({
  isOpen: false,
  snippet: null as Snippet | null
})

function openEditSnippetModal(snippet: Snippet) {
  editSnippetModalData.snippet = snippet
  editSnippetModalData.isOpen = true
}

function openDeleteSnippetModal(snippet: Snippet) {
  deleteSnippetModalData.snippet = snippet
  deleteSnippetModalData.isOpen = true
}

function onDelete() {
  if (deleteSnippetModalData.snippet) {
    emits('delete', deleteSnippetModalData.snippet)
  }
}

function onUpdate() {
  if (editSnippetModalData.snippet) {
    emits('update', editSnippetModalData.snippet)
  }
}
</script>

<style scoped lang="sass">
.snippet-list
	&__item
		display: flex
		border-bottom: 1px solid var(--border-color)
		padding: 0.5em 0

		&__index
			flex: 0 0 30px
			display: flex
			justify-content: center
			align-items: center
			font-weight: bold

		&__name
			flex: 1

		&__actions
			display: flex
			gap: 1em
			padding-right: 1em

			&__edit
				cursor: pointer

				&:hover
					--form-text-color: var(--text-light)

			&__delete
				cursor: pointer

				&:hover
					--danger: var(--text-light)

	&__no-snippets
		color: var(--text-light)
		font-size: 14px
</style>
