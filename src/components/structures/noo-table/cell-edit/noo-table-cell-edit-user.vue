<template>
  <user-select
    label="Выберите пользователя"
    v-model="userModel"
  />
</template>

<script setup lang="ts">
import type { TableCell } from '@/core/data/entities/TableCell'
import type { User } from '@/core/data/entities/User'
import { computed, ref, watch } from 'vue'

interface Props {
  modelValue: TableCell
  isValid: [boolean, string?]
}

interface Emits {
  (event: 'update:modelValue', value: TableCell): void
  (event: 'update:isValid', value: [boolean, string?]): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const userModel = computed({
  get: () => (props.modelValue.metadata as User) || null,
  set: (user) => {
    emits('update:modelValue', {
      ...props.modelValue,
      value: user?.id || '',
      metadata: ref(user) || null
    })
  }
})

const isValidModel = computed({
  get: () => props.isValid,
  set: (value) => emits('update:isValid', value)
})

watch(userModel, validate, { immediate: true })

function validate() {
  if (!userModel.value) {
    isValidModel.value = [false, 'Необходимо выбрать пользователя']
  } else {
    isValidModel.value = [true]
  }
}
</script>
