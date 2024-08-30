<template>
  <entity-select-input
    :label="label"
    :fetch-function="getRoles"
    :label-keys="['label']"
    :max-count="1"
    v-model="roleModel"
  />
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { VisibleRole } from '@/core/services/api/UserService'
import { computed } from 'vue'

interface Props {
  label: string
  modelValue: VisibleRole | null
}

interface Emits {
  (event: 'update:modelValue', value: VisibleRole | null): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const userService = Core.Services.User

async function getRoles(pagination?: Pagination) {
  return {
    data: userService.getRoles(pagination)
  }
}

const roleModel = computed<VisibleRole[]>({
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
