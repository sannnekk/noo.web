<template>
  <base-modal
    type="warning"
    :title="`Ошибка интеграции ${bindingName}`"
    v-model:visible="visibilityModel"
  >
    <p>{{ props.error }}</p>
  </base-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  visible: boolean
  bindingName: string
  error: string
}

interface Emits {
  (event: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const visibilityModel = computed({
  get: () => props.visible,
  set: (value: boolean) => emits('update:visible', value)
})
</script>
