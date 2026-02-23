<template>
  <sure-modal
    v-model:visible="visibilityModel"
    @confirm="assignedWorksStore.unarchiveWorks(assignedWorks)"
  >
    <template #title>
      <h2>Разархивировать работы</h2>
    </template>
    <template #text>
      <div class="archive-works-modal__label">
        Выбрано работ: {{ assignedWorks.length }}
      </div>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import { useAssignedWorksStore } from '../stores/assigned-works'

interface Props {
  visible: boolean
  assignedWorks: AssignedWork[]
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const assignedWorksStore = useAssignedWorksStore()

const visibilityModel = computed({
  get: () => props.visible,
  set: (value) => emits('update:visible', value)
})
</script>

<style scoped lang="sass"></style>
