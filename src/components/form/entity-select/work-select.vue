<template>
  <entity-select-input
    :label="label"
    :fetch-function="fetchWorks"
    :label-keys="['subject.name', 'name']"
    :max-count="1"
    v-model="userModel"
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
  modelValue: Work | null
  subjectId?: Subject['id']
}

interface Emits {
  (event: 'update:modelValue', value: Work | null): void
}

const props = defineProps<Props>()
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

const userModel = computed<Work[]>({
  get: () => {
    if (props.modelValue) {
      return [props.modelValue]
    }

    return []
  },
  set: (value) => {
    if (value.length === 0) {
      emits('update:modelValue', null)
    }

    emits('update:modelValue', value[0])
  }
})
</script>
