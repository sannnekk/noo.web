<template>
  <div
    class="assigned-work-progress"
    v-if="visible"
  >
    <span
      class="assigned-work-progress__text"
      :style="{ color: progress.color }"
    >
      {{ progress.text }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import { type AssignedWorkProgress } from '@/core/data/entities/AssignedWork'
import { computed, ref, watch } from 'vue'

interface Props {
  workId: string
  hideNotStarted?: boolean
}

const props = defineProps<Props>()

const isLoading = ref(true)

const assignedWorkService = Core.Services.AssignedWork

const progressData = ref<AssignedWorkProgress | Error | null>(null)

const progress = computed<{
  color: string
  text: string
  id: string
}>(() => {
  if (isLoading.value) {
    return {
      id: 'loading',
      color: 'var(--text-light)',
      text: 'Загрузка...'
    }
  }

  if (progressData.value instanceof Error) {
    return {
      id: 'error',
      color: 'var(--danger)',
      text: 'Ошибка загрузки прогресса'
    }
  }

  if (progressData.value === null) {
    return {
      id: 'not-started',
      color: 'var(--text-light)',
      text: 'Работа не начата'
    }
  }

  const checkStatus = progressData.value.checkStatus
  const percent = `${(
    (progressData.value.score! / progressData.value.maxScore) *
    100
  ).toFixed(2)}%`

  if (
    checkStatus === 'checked-after-deadline' ||
    checkStatus === 'checked-automatically' ||
    checkStatus === 'checked-in-deadline'
  ) {
    return {
      id: 'checked',
      color: 'var(--success)',
      text: `Работа проверена, результат: ${percent}`
    }
  }

  const solveStatus = progressData.value.solveStatus

  if (solveStatus === 'in-progress') {
    return {
      id: 'in-progress',
      color: 'var(--warning)',
      text: 'Работа в процессе'
    }
  }

  if (solveStatus === 'made-in-deadline') {
    return {
      id: 'made-in-deadline',
      color: 'var(--success)',
      text: 'Работа сдана в дедлайн'
    }
  }

  if (solveStatus === 'made-after-deadline') {
    return {
      id: 'made-after-deadline',
      color: 'var(--warning)',
      text: 'Работа сдана после дедлайна'
    }
  }

  return {
    id: 'not-started',
    color: 'var(--text-light)',
    text: 'Работа не начата'
  }
})

const visible = computed(() => {
  if (props.hideNotStarted && progress.value.id === 'not-started') {
    return false
  }

  return true
})

async function fetchProgress() {
  isLoading.value = true

  try {
    const response = await assignedWorkService.getAssignedWorkProgress(
      props.workId
    )
    progressData.value = response.data
  } catch (error: any) {
    progressData.value = error
  } finally {
    isLoading.value = false
  }
}

watch(() => props.workId, fetchProgress, { immediate: true })
</script>

<style scoped lang="sass">
.assigned-work-progress
	&__text
		display: inline-block
		line-height: 1.1em
</style>
