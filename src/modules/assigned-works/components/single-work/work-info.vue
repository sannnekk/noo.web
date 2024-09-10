<template>
  <div
    class="work-info"
    v-if="assignedWorkStore.assignedWork?.work"
  >
    <div class="work-info__section subject">
      <subject-name :subject="assignedWorkStore.assignedWork.work.subject" />
    </div>
    <div class="work-info__section type">
      <h2>
        {{ readableWorkType(assignedWorkStore.assignedWork.work!.type) }}
      </h2>
    </div>
    <div class="work-info__section solve-status">
      Статус работы:
      <assigned-work-solve-status
        :status="assignedWorkStore.assignedWork.solveStatus"
      />
    </div>
    <div
      class="work-info__section solve-deadline-at"
      v-if="assignedWorkStore.assignedWork.solveDeadlineAt"
    >
      Дедлайн сдачи:
      {{
        useDate(assignedWorkStore.assignedWork.solveDeadlineAt, {
          precision: 'day'
        }).toBeautiful()
      }}
    </div>
    <div
      class="work-info__section solved-at"
      v-if="assignedWorkStore.assignedWork.solvedAt"
    >
      Работа сдана:
      {{
        useDate(assignedWorkStore.assignedWork.solvedAt, {
          precision: 'day'
        }).toBeautiful()
      }}
    </div>
    <div class="work-info__section check-status">
      Статус проверки:
      <assigned-work-check-status
        :status="assignedWorkStore.assignedWork.checkStatus"
      />
    </div>
    <div
      class="work-info__section solve-deadline-at"
      v-if="assignedWorkStore.assignedWork.checkDeadlineAt"
    >
      Дедлайн проверки:
      {{
        useDate(assignedWorkStore.assignedWork.checkDeadlineAt, {
          precision: 'day'
        }).toBeautiful()
      }}
    </div>
    <div
      class="work-info__section checked-at"
      v-if="assignedWorkStore.assignedWork.checkedAt"
    >
      Работа проверена:
      {{
        useDate(assignedWorkStore.assignedWork.checkedAt, {
          precision: 'day'
        }).toBeautiful()
      }}
    </div>
  </div>
  <div
    class="work-info__loading"
    v-else
  >
    <loader-icon contrast />
  </div>
</template>

<script setup lang="ts">
import type { Work } from '@/core/data/entities/Work'
import { useAssignedWorkStore } from '../../stores/assigned-work'
import { useDate } from '@/composables/useDate'

const assignedWorkStore = useAssignedWorkStore()

function readableWorkType(type: Work['type']) {
  switch (type) {
    case 'trial-work':
      return 'Пробник'
    case 'phrase':
      return 'Фраза'
    case 'mini-test':
      return 'Мини-зачет'
    case 'test':
      return 'Тест'
    case 'second-part':
      return 'Вторая часть'
    default:
      return '-'
  }
}
</script>

<style scoped lang="sass">
.work-info
	&__section
		padding: 0.3em 0
		color: var(--text-light)
		font-size: 0.9em

		&.type
			color: var(--form-text-color)
			font-size: 1em

		&.subject
			color: var(--form-text-color)
			font-size: 1em



	&__loading
		min-height: 250px
		display: flex
		justify-content: center
		align-items: center
		font-size: 30px
</style>
