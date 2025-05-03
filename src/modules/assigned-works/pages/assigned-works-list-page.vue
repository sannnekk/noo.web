<template>
  <div class="assigned-works-list-page"></div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useAssignedWorkListStore } from '../stores/assigned-work-list.store'
import type { AssignedWorkListTab } from '../types'

interface Props {
  tabId: AssignedWorkListTab
  userId?: string
}

const props = defineProps<Props>()
const assignedWorksListStore = useAssignedWorkListStore()

watch(
  [() => props.tabId, () => props.userId],
  () => {
    assignedWorksListStore.setUserId(props.userId)
    assignedWorksListStore.setTabId(props.tabId)
  },
  { immediate: true }
)
</script>

<style scoped lang="sass"></style>
