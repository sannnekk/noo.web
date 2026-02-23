<template>
  <div
    class="favourite-task-card"
    v-auto-animate
  >
    <div class="favourite-task-card__inner">
      <div class="favourite-task-card__header">
        <div class="favourite-task-card__header__title">
          <span>Задание из работы:</span>
          <h3>{{ favouriteTask.task?.work?.name }}</h3>
        </div>
        <div class="favourite-task-card__header__actions">
          <span
            class="favourite-task-card__header__actions__delete"
            @click="isDeleteModalVisible = true"
          >
            <inline-icon name="delete" /> Удалить карточку
          </span>
        </div>
      </div>
      <div class="favourite-task-card__body">
        <div class="favourite-task-card__body__task">
          <rich-text-container :content="favouriteTask.task?.content!" />
        </div>
        <div
          class="favourite-task-card__body__hint"
          v-if="favouriteTask.task?.solveHint && !isAnswerVisible"
          v-auto-animate
        >
          <div
            class="favourite-task-card__body__hint__text"
            v-if="isHintVisible"
          >
            <rich-text-container :content="favouriteTask.task?.solveHint!" />
          </div>
          <div class="favourite-task-card__body__hint__actions">
            <common-button
              @click="isHintVisible = !isHintVisible"
              alignment="center"
              design="inline"
            >
              {{ isHintVisible ? 'Скрыть' : 'Показать' }} подсказку
            </common-button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="favourite-task-card__hidden"
      v-if="isAnswerVisible"
    >
      <h3 class="favourite-task-card__hidden__title">Правильный ответ:</h3>
      <p class="favourite-task-card__hidden__text">
        {{ favouriteTask.task?.rightAnswer?.split('|').join(', или ') }}
      </p>
      <h3
        class="favourite-task-card__hidden__title"
        v-if="favouriteTask.task?.checkHint"
      >
        Пояснение:
      </h3>
      <p
        class="favourite-task-card__hidden__check-hint"
        v-if="favouriteTask.task?.checkHint"
      >
        <rich-text-container :content="favouriteTask.task?.checkHint" />
      </p>
    </div>
  </div>
  <sure-delete-modal
    v-model:visible="isDeleteModalVisible"
    @confirm="$emit('delete')"
  >
    <template #title> Удаление карточки </template>
    <template #text>
      Вы уверены, что хотите удалить карточку с заданием?
    </template>
  </sure-delete-modal>
</template>

<script setup lang="ts">
import type { FavouriteTask } from '@/core/data/entities/FavouriteTask'
import { ref } from 'vue'

interface Props {
  favouriteTask: FavouriteTask
  isAnswerVisible: boolean
}

interface Emits {
  (event: 'delete'): void
}

defineProps<Props>()
defineEmits<Emits>()

const isHintVisible = ref(false)
const isDeleteModalVisible = ref(false)
</script>

<style scoped lang="sass">
.favourite-task-card
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
	border-radius: var(--border-radius)
	margin-bottom: 1em

	&__header
		display: flex
		justify-content: space-between
		padding: 1em

		@media (max-width: 996px)
			flex-direction: column

		&__title
			span
				font-size: 0.8em

			h3
				margin: 0

		&__actions
			font-size: 0.8em

			@media (max-width: 996px)
				margin-top: 1em

			&__delete
				color: var(--danger)
				cursor: pointer

				&:hover
					color: var(--text-light)

					&:deep()
						path, rect
							fill: var(--text-light) !important
							stroke: var(--text-light) !important

	&__body
		padding-bottom: 1em

		&__task
			margin-bottom: 1em
			padding: 0.5em

		&__hint
			padding: 0.5em

		&__show-answer
			padding: 0 1em
			font-size: 0.8em

	&__hidden
		padding: 1em

		&__check-hint
			&:deep()
				.quill-editor__content
					padding: 0

		&__actions
			font-size: 0.8em
			display: flex
			gap: 0.5em
</style>
