<template>
  <entity-select-input
    :label="label"
    :fetch-function="fetchPolls"
    :label-keys="['title']"
    :max-count="1"
    v-model="pollModel"
  />
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { Poll } from '@/core/data/entities/Poll'
import { computed } from 'vue'

interface Props {
  label: string
  modelValue: Poll | null
}

interface Emits {
  (event: 'update:modelValue', value: Poll | null): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const pollService = Core.Services.Poll
const uiService = Core.Services.UI

async function fetchPolls(pagination?: Pagination) {
  try {
    return pollService.getPolls(pagination)
  } catch (error: any) {
    uiService.openErrorModal(
      'Произошла ошибка при загрузке опросов',
      error.message
    )
  }
}

const pollModel = computed<Poll[]>({
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
