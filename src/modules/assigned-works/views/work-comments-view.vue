<template>
  <div
    class="work-comments-view"
    :key="assignedWorkStore.assignedWork?.id"
    v-if="assignedWorkStore.assignedWork"
  >
    <work-comment
      :mode="assignedWorkStore.mode"
      v-model:student-comment="assignedWorkStore.assignedWork.studentComment"
      v-model:mentor-comment="assignedWorkStore.assignedWork.mentorComment"
    />
  </div>
</template>

<script setup lang="ts">
import WorkComment from '../components/single-work/work-comment.vue'
import { useAssignedWorkStore } from '../stores/assigned-work'

const assignedWorkStore = useAssignedWorkStore()
</script>
