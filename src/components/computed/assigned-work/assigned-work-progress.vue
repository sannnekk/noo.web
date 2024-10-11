<template>
  <div class="assigned-work-progress">
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
}

const props = defineProps<Props>()

const isLoading = ref(true)

const assignedWorkService = Core.Services.AssignedWork

const progressData = ref<AssignedWorkProgress | Error | null>(null)

const progress = computed<{
  color: string
  text: string
}>(() => {
  if (isLoading.value) {
    return {
      color: 'var(--text-light)',
      text: 'Загрузка...'
    }
  }

  if (progressData.value instanceof Error) {
    return {
      color: 'var(--danger)',
      text: 'Ошибка загрузки прогресса'
    }
  }

  if (progressData.value === null) {
    return {
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
      color: 'var(--success)',
      text: `Работа проверена, результат: ${percent}`
    }
  }

  const solveStatus = progressData.value.solveStatus

  if (solveStatus === 'in-progress') {
    return {
      color: 'var(--warning)',
      text: 'Работа в процессе'
    }
  }

  if (solveStatus === 'made-in-deadline') {
    return {
      color: 'var(--success)',
      text: 'Работа сдана в дедлайн'
    }
  }

  if (solveStatus === 'made-after-deadline') {
    return {
      color: 'var(--warning)',
      text: 'Работа сдана после дедлайна'
    }
  }

  return {
    color: 'var(--text-light)',
    text: 'Работа не начата'
  }
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
