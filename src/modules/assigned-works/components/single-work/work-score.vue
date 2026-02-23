<template>
  <p
    class="work-score"
    v-if="assignedWorkStore.mode !== 'solve'"
  >
    Оценка:
    <b>{{
      assignedWorkStore.workScore.value === null
        ? 'Не выставлена'
        : assignedWorkStore.workScore.value
    }}</b>
    из
    <b>{{ assignedWorkStore.workScore.of }}</b>
    <br />
    ({{ assignedWorkStore.workScore.percentage }}%)
  </p>
</template>

<script setup lang="ts">
import { useAssignedWorkStore } from '../../stores/assigned-work'

const assignedWorkStore = useAssignedWorkStore()
</script>

<style lang="sass" scoped>
.work-score
	color: var(--text-light)

	b
		color: var(--form-text-color)
</style>
