<template>
  <entity-select-input
    :label="label"
    :fetch-function="fetchWorks"
    :label-keys="['subject.name', 'name']"
    :max-count="maxCount"
    v-model="worksModel"
  />
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { Subject } from '@/core/data/entities/Subject'
import type { Work } from '@/core/data/entities/Work'
import { computed } from 'vue'

interface Props {
  label: string
  modelValue: Work[]
  subjectId?: Subject['id']
  maxCount?: number
}

interface Emits {
  (event: 'update:modelValue', value: Work[]): void
}

const props = withDefaults(defineProps<Props>(), { maxCount: 3 })
const emits = defineEmits<Emits>()

const workService = Core.Services.Work
const uiService = Core.Services.UI

async function fetchWorks(pagination: Pagination) {
  try {
    if (props.subjectId) {
      pagination = {
        ...pagination,
        'filter[subjectId]': {
          type: 'string',
          value: props.subjectId
        }
      }
    }

    return workService.getWorks(pagination)
  } catch (error: any) {
    uiService.openErrorModal(
      'Произошла ошибка при загрузке пользователей',
      error.message
    )
  }
}

const worksModel = computed<Work[]>({
  get: () => props.modelValue ?? [],
  set: (value) => emits('update:modelValue', value)
})
</script>
