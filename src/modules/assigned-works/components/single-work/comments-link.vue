<template>
  <div
    class="comments-link"
    v-if="assignedWorkStore.baseUrl"
  >
    <inline-button
      icon="edit"
      :to="assignedWorkStore.baseUrl"
    >
      Комментарии к работе
    </inline-button>
  </div>
</template>

<script setup lang="ts">
import { useAssignedWorkStore } from '../../stores/assigned-work'

const assignedWorkStore = useAssignedWorkStore()
</script>

<style lang="sass" scoped>
.comments-link
	margin-bottom: 1em
	font-size: 0.9em
</style>
