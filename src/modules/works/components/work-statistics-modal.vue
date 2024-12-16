<template>
  <base-modal
    v-model:visible="visibilityModel"
    type="info"
    :title="`Статистика по работе ${work?.name}`"
  >
    <div
      class="work-statistics-modal"
      v-auto-animate
    >
      <div
        class="work-statistics-modal__content"
        v-if="!loading"
      >
        <div class="row">
          <div class="col-md-4">
            <div class="work-statistics-modal__content__card">
              <h1 class="work-statistics-modal__content__card__number">
                {{ workStatistics?.workSolveCount || '-' }}
              </h1>
              <p class="work-statistics-modal__content__card__title">
                Всего решено
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="work-statistics-modal__content__card">
              <h1 class="work-statistics-modal__content__card__number">
                {{ workStatistics?.averageWorkScore || '-' }}
              </h1>
              <p class="work-statistics-modal__content__card__title">
                Средний балл
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="work-statistics-modal__content__card">
              <h1 class="work-statistics-modal__content__card__number">
                {{ workStatistics?.medianWorkScore || '-' }}
              </h1>
              <p class="work-statistics-modal__content__card__title">
                Медианный балл
              </p>
            </div>
          </div>
        </div>
        <h3 class="work-statistics-modal__content__title">
          Самые сложные задания
        </h3>
        <div class="work-statistics-modal__content__hardest-tasks">
          <div
            class="work-statistics-modal__content__hardest-tasks__item"
            v-for="task in hardestTasks"
            :key="task.id"
            v-auto-animate
          >
            <div
              class="work-statistics-modal__content__hardest-tasks__item__number"
            >
              Номер {{ task.order }}
            </div>
            <div
              class="work-statistics-modal__content__hardest-tasks__item__score"
            >
              Средний балл: {{ task.averageScore.toFixed(2) }} %
            </div>
            <div
              class="work-statistics-modal__content__hardest-tasks__item__link"
            >
              <common-button :to="`/create-work${work?.slug}/${task.slug}`">
                Посмотреть
              </common-button>
            </div>
            <div
              class="work-statistics-modal__content__hardest-tasks__item__text"
            >
              <rich-text-container :content="task.shortText" />
            </div>
          </div>
          <div
            class="work-statistics-modal__content__hardest-tasks__not-found"
            v-if="!hardestTasks.length"
          >
            <p>Самые сложные задания не найдены</p>
          </div>
        </div>
      </div>
      <div
        class="work-statistics-modal__loader"
        v-else
      >
        <loader-icon contrast />
      </div>
    </div>
  </base-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Work } from '@/core/data/entities/Work'
import { Core } from '@/core/Core'
import type { WorkStatistics } from '@/core/data/entities/WorkStatistics'
import { sliceTop } from '@/core/utils/deltaHelpers'

interface Props {
  visible: boolean
  work: Work | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const workService = Core.Services.Work
const uiService = Core.Services.UI

const loading = ref(false)

const visibilityModel = computed({
  get: () => props.visible,
  set: (value) => emits('update:visible', value)
})

const workStatistics = ref<WorkStatistics | null>(null)

const hardestTasks = computed(() => {
  if (!workStatistics.value?.work) {
    return []
  }

  return workStatistics.value.hardestTaskIds
    .map((hardestTask) => {
      const task = workStatistics.value?.work?.tasks.find(
        (t) => t.id === hardestTask.taskId
      )

      return {
        id: hardestTask.taskId,
        order: task!.order,
        averageScore: hardestTask.avgScore,
        shortText: sliceTop(task!.content, 2),
        slug: task!.slug
      }
    })
    .sort((a, b) => a.averageScore - b.averageScore)
})

watch(
  visibilityModel,
  async (value) => {
    if (value) {
      loading.value = true

      try {
        await loadStatistics()
      } catch (error: any) {
        uiService.openErrorModal(
          'Ошибка при загрузке статистики',
          error.message
        )
      } finally {
        loading.value = false
      }
    }
  },
  { immediate: true }
)

async function loadStatistics() {
  if (!props.work?.id) {
    throw new Error('Не передан идентификатор работы')
  }

  const response = await workService.getWorkStatistics(props.work.id)

  workStatistics.value = response.data
}
</script>

<style scoped lang="sass">
.work-statistics-modal
	&__content
		padding-bottom: 1em

		&__card
			border-radius: var(--border-radius)
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
			padding: 1em

			&__number
				margin-bottom: 0.3em
				margin-top: 0

			&__title
				color: var(--text-light)
				font-size: 14px
				margin: 0

		&__title
			font-weight: 500
			font-size: 18px
			margin-bottom: 1em

		&__hardest-tasks
			display: flex
			flex-direction: column
			gap: 1em

			&__item
				padding: 1em
				display: flex
				flex-wrap: wrap
				align-items: center
				border: 1px solid var(--border-color)
				border-radius: var(--border-radius)

				&__number
					color: var(--form-text-color)
					font-size: 16px
					font-weight: bold

				&__score
					color: var(--text-light)
					font-size: 16px
					margin-right: 1em
					flex: 1
					margin-left: 0.7em

				&__text
					margin-top: 1em
					border-top: 1px solid var(--border-color)
					width: 100%

			&__not-found
				color: var(--text-light)

	&__loader
		display: flex
		align-items: center
		justify-content: center
		padding: 2em 0
		font-size: 3em
</style>
