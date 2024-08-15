<template>
  <div class="subject-list">
    <div
      class="subject-list__item"
      v-for="subject in subjects"
      :key="subject.id"
    >
      <div class="subject-list__item__name">
        <subject-name :subject="subject" />
      </div>
      <div
        class="subject-list__item__actions"
        v-if="Core.Context.roleIs(['admin'])"
      >
        <div class="subject-list__item__actions__edit">
          <inline-icon
            name="edit"
            @click="openEditSubjectModal(subject)"
          />
        </div>
        <div class="subject-list__item__actions__delete">
          <inline-icon
            name="delete"
            @click="openDeleteSubjectModal(subject)"
          />
        </div>
      </div>
    </div>
    <div
      class="subject-list__no-items"
      v-if="subjects.length === 0"
    >
      <p>Пока нет предметов</p>
    </div>
  </div>
  <sure-modal
    v-model:visible="editSubjectModal.isOpen"
    @confirm="onEdit()"
  >
    <template #title>Изменить предмет</template>
    <template #text>
      <form-input
        label="Название предмета"
        v-model="editSubjectModal.subject!.name"
        type="text"
      />
      <form-input
        label="Цвет предмета"
        v-model="editSubjectModal.subject!.color"
        type="color"
      />
    </template>
  </sure-modal>
  <sure-modal
    v-model:visible="deleteSubjectModal.isOpen"
    @confirm="onDelete()"
  >
    <template #title>
      Удалить предмет "{{ deleteSubjectModal.subject?.name }}"
    </template>
    <template #text>
      <warning-block>
        Вы уверены, что хотите удалить предмет?<br />
        Это действие нельзя будет отменить. <br />
        Перед удалением предмета нужно удалить все связанные с ним курсы и
        работы
      </warning-block>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { Subject } from '@/core/data/entities/Subject'
import { reactive } from 'vue'

interface Props {
  subjects: Subject[]
}

interface Emits {
  (event: 'update-subject', subject: Subject): void
  (event: 'delete-subject', subject: Subject): void
}

defineProps<Props>()
const emits = defineEmits<Emits>()

const editSubjectModal = reactive({
  subject: null as Subject | null,
  isOpen: false
})

const deleteSubjectModal = reactive({
  subject: null as Subject | null,
  isOpen: false
})

function openEditSubjectModal(subject: Subject) {
  editSubjectModal.subject = subject
  editSubjectModal.isOpen = true
}

function openDeleteSubjectModal(subject: Subject) {
  deleteSubjectModal.subject = subject
  deleteSubjectModal.isOpen = true
}

function onEdit() {
  if (editSubjectModal.subject) {
    emits('update-subject', editSubjectModal.subject)
  }

  editSubjectModal.subject = null
}

function onDelete() {
  if (deleteSubjectModal.subject) {
    emits('delete-subject', deleteSubjectModal.subject)
  }

  deleteSubjectModal.subject = null
}
</script>

<style scoped lang="sass">
.subject-list
	&__item
		display: flex
		justify-content: space-between
		align-items: center
		padding: 10px 0
		border-bottom: 1px solid var(--border-color)

		&__name
			flex-grow: 1

		&__actions
			display: flex

			&__edit
				margin-right: 1em
				cursor: pointer

				&:hover
					--form-text-color: var(--lila)

			&__delete
				cursor: pointer

				&:hover
					--danger: var(--form-text-color)
</style>
