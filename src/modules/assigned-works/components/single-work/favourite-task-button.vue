<template>
  <span class="favourite-task-button">
    <loader-icon
      v-if="isLoading"
      class="favourite-task-button__icon favourite-task-button__icon--loading"
      contrast
    />
    <inline-icon
      v-else-if="state === 'added'"
      name="star"
      class="favourite-task-button__icon favourite-task-button__icon--active"
      @click="toggleFavourite()"
    />
    <inline-icon
      v-else-if="state === 'not-added'"
      name="star"
      class="favourite-task-button__icon favourite-task-button__icon--inactive"
      @click="toggleFavourite()"
    />
    <span
      class="favourite-task-button__text"
      v-if="state === 'not-added'"
      @click="toggleFavourite()"
    >
      Добавить карточку
    </span>
    <span
      class="favourite-task-button__text"
      @click="toggleFavourite()"
      v-else
    >
      Убрать карточку
    </span>
    <span class="favourite-task-button__tooltip">
      <explanation-tooltip title="Карточки с заданиями">
        <p class="favourite-task-button__tooltip__text">
          Вы можете сохранять задания в виде карточек, как в Quizlet. Для того
          чтобы сохранить задание, нажмите на звездочку рядом с ним, когда
          решаете работу. Пока это работает только с заданиями из тестов,
          которые проверяются автоматически. Созданные карточки находятся на
          странице "Работы" в разделе "Карточки с заданиями".
        </p>
      </explanation-tooltip>
    </span>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Core } from '@/core/Core'

interface Props {
  taskId: string
}

const props = defineProps<Props>()

const state = ref<'added' | 'not-added'>('added')
const isLoading = ref(false)

async function toggleFavourite() {
  if (isLoading.value) return

  isLoading.value = true

  try {
    if (state.value === 'not-added') {
      await Core.Services.AssignedWork.addTaskToFavourites(props.taskId)
      state.value = 'added'
    } else {
      await Core.Services.AssignedWork.removeTaskFromFavourites(props.taskId)
      state.value = 'not-added'
    }
  } catch (error: any) {
    Core.Services.UI.openErrorModal(
      'Не удалось добавить задание в избранное или удалить задание из избранного',
      error.message
    )
  } finally {
    isLoading.value = false
  }
}

async function fetchState() {
  try {
    const response = await Core.Services.AssignedWork.isTaskFavourite(
      props.taskId
    )
    state.value = response.data ? 'added' : 'not-added'
  } catch (error: any) {
    state.value = 'not-added'
  }
}

fetchState()
</script>

<style scoped lang="sass">
.favourite-task-button
	font-weight: 500
	cursor: pointer

	&:hover
		color: var(--text-light)

		&:deep()
			path
				fill: var(--text-light)

	&__icon
		fill: none
		stroke: var(--form-text-color)
		display: inline-block
		position: relative
		top: 2px

		&--active
			&:deep()
				path
					fill: var(--warning) !important
					stroke: var(--warning) !important

	&__text
		margin-left: 0.2rem

	&__tooltip
		margin-left: -0.2em
		vertical-align: middle

		&__text
			color: var(--text-light)
</style>
