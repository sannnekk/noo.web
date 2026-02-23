<template>
  <div class="favourite-task-view">
    <div class="favourite-task-view__info">
      <p>
        В этом разделе вы можете просматривать сохраненные задания в виде
        карточек, как в Quizlet. Для того чтобы сохранить задание, нажмите на
        звездочку рядом с ним, когда решаете работу. Пока это работает только с
        заданиями из тестов, которые проверяются автоматически.
      </p>
    </div>
    <div
      class="favourite-task-view__form"
      v-if="favouriteTaskStore.quizData.state === 'form'"
    >
      <h3 class="favourite-task-view__form__header">Тренировка по карточкам</h3>
      <div class="row">
        <div class="col-md-4">
          <div class="form-group">
            <subject-select-input
              label="Предмет"
              v-model="favouriteTaskStore.quizData.subjectId"
            />
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group">
            <select-input
              label="Количество карточек"
              v-model="favouriteTaskStore.quizData.cardsCount"
              :options="[
                { value: 10, label: '10' },
                { value: 25, label: '25' },
                { value: 50, label: '50' }
              ]"
            />
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group checkbox">
            <form-checkbox
              label="Удалять карточку если ответ правильный"
              v-model="favouriteTaskStore.quizData.deleteCorrect"
            />
          </div>
        </div>
      </div>
      <div class="favourite-task-view__form__errors">
        <error-block v-if="favouriteTaskStore.errors.length">
          {{ favouriteTaskStore.errors.join(', ') }}
        </error-block>
      </div>
      <div class="favourite-task-view__form__actions">
        <common-button
          @click="favouriteTaskStore.startQuiz()"
          alignment="right"
          design="primary"
        >
          Начать
        </common-button>
      </div>
    </div>
    <div
      class="favourite-task-view__quiz"
      v-else-if="favouriteTaskStore.quizData.state === 'quiz'"
    >
      <div
        class="favourite-task-view__quiz__card"
        v-if="favouriteTaskStore.quizData.currentFavouriteTask"
        :key="favouriteTaskStore.quizData.currentFavouriteTask.id"
      >
        <favourite-task-card
          :favourite-task="favouriteTaskStore.quizData.currentFavouriteTask"
          :is-answer-visible="favouriteTaskStore.isCurrentTaskSolved"
          @delete="favouriteTaskStore.deleteCurrentCard()"
        />
      </div>
      <div
        class="favourite-task-view__quiz__answer-form"
        v-if="favouriteTaskStore.quizData.currentFavouriteTask"
      >
        <form-input
          type="text"
          label="Ответ:"
          v-model="favouriteTaskStore.quizData.currentAnswer"
          :readonly="favouriteTaskStore.isCurrentTaskSolved"
          :validators="[
						(val: any) => val.trim().length > 0 || 'Введите ответ'
					]"
        />
      </div>
      <div class="favourite-task-view__quiz__actions">
        <common-button
          @click="favouriteTaskStore.previousCard()"
          alignment="stretch"
          design="secondary"
        >
          Назад
        </common-button>
        <common-button
          @click="favouriteTaskStore.submitAnswer()"
          alignment="stretch"
          design="primary"
          v-if="!favouriteTaskStore.isCurrentTaskSolved"
        >
          Ответить
        </common-button>
        <common-button
          @click="favouriteTaskStore.nextCard()"
          alignment="stretch"
          design="primary"
          v-else
        >
          Дальше
        </common-button>
        <common-button
          @click="favouriteTaskStore.endQuiz()"
          alignment="stretch"
          design="danger"
        >
          Закончить
        </common-button>
      </div>
      <div class="favourite-task-view__quiz__statistics">
        <p>
          Всего карточек: <b>{{ favouriteTaskStore.totalCount }}</b>
        </p>
        <p>
          Правильных ответов:
          <b>{{ favouriteTaskStore.correctCount }}</b>
        </p>
      </div>
    </div>

    <div
      class="favourite-task-view__result"
      v-else-if="favouriteTaskStore.quizData.state === 'result'"
    >
      <h3 class="favourite-task-view__result__title">Ваш результат</h3>
      <p class="favourite-task-view__result__text">
        Правильных ответов: <b>{{ favouriteTaskStore.correctCount }}</b> ({{
          favouriteTaskStore.correctPercentage
        }}%)
      </p>
      <div class="favourite-task-view__result__actions">
        <common-button
          @click="favouriteTaskStore.restartQuiz()"
          design="primary"
          alignment="center"
        >
          Попробовать еще раз
        </common-button>
        <common-button
          class="favourite-task-view__result__actions__small"
          @click="favouriteTaskStore.exitQuiz()"
          design="inline"
          alignment="center"
        >
          Вернуться в меню
        </common-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import favouriteTaskCard from './favourite-task-card.vue'
import { useFavoriteTaskStore } from '../../stores/favourite-tasks'

const favouriteTaskStore = useFavoriteTaskStore()
</script>

<style scoped lang="sass">
.favourite-task-view
	padding: 1em

	&__info
		color: var(--text-light)

	&__form
		.form-group
			&.checkbox
				display: flex
				align-items: flex-end
				height: 100%
				min-height: 3em

				&:deep()
					label
						color: var(--text-light)

		&__errors
			margin: 1em 0

		&__actions
			margin-top: 2em

	&__quiz
		width: min(100%, 800px)
		margin: 0em auto
		padding-top: 2em

		&__actions
			margin-top: 1em
			display: flex
			gap: 0.5em

			@media (max-width: 996px)
				flex-direction: column

		&__statistics
			text-align: center
			margin: 1em 0

			p
				margin: 0

	&__result
		text-align: center
		margin-top: 4em

		&__text
			margin: 2em 0

		&__actions
			margin-top: 2em
			margin-bottom: 2em
			display: flex
			flex-direction: column
			gap: 1em

			&__small
				font-size: 0.8em
</style>
