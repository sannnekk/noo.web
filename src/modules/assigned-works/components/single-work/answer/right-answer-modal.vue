<template>
  <base-modal
    v-model:visible="visibilityModel"
    type="info"
    title="Правильный ответ"
  >
    <form-input
      type="text"
      :modelValue="rightAnswer"
      label="Правильный ответ"
      readonly
    />
    <br />
  </base-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  visible: boolean
  rightAnswer: string
}

interface Emits {
  (event: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const visibilityModel = computed({
  get: () => props.visible,
  set: (value: boolean) => {
    emits('update:visible', value)
  }
})
</script>

<style scoped></style>
