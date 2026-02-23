<template>
  <entity-select-input
    :label="label"
    :fetch-function="fetchSubjects"
    :label-keys="['name']"
    :max-count="1"
    v-model="subjectModel"
  />
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { Subject } from '@/core/data/entities/Subject'
import { computed } from 'vue'

interface Props {
  label: string
  modelValue: Subject | null
}

interface Emits {
  (event: 'update:modelValue', value: Subject | null): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const subjectService = Core.Services.Subject
const uiService = Core.Services.UI

async function fetchSubjects(pagination?: Pagination) {
  try {
    return subjectService.getSubjects(pagination)
  } catch (error: any) {
    uiService.openErrorModal(
      'Произошла ошибка при загрузке предметов',
      error.message
    )
  }
}

const subjectModel = computed<Subject[]>({
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
