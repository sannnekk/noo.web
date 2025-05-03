<template>
  <div class="assigned-works-detail-page"></div>
</template>

<script setup lang="ts">
import { onUnmounted, provide } from 'vue'
import { useAssignedWorkDetailStore } from '../stores/assigned-work-detail.store'
import type { AssignedWorkViewMode } from '../types'

interface Props {
  assignedWorkId: string
  mode: AssignedWorkViewMode
}

const props = defineProps<Props>()
const assignedWorkDetailStore = useAssignedWorkDetailStore()

onUnmounted(() => {
  assignedWorkDetailStore.reset()
})
</script>

<style scoped lang="sass"></style>
