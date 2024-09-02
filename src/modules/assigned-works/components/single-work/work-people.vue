<template>
  <div
    class="work-people"
    v-if="assignedWorkStore.assignedWork"
  >
    <div class="work-people__student">
      <label>Ученик: </label>
      <user-card :user="assignedWorkStore.assignedWork.student!" />
    </div>
    <div
      class="work-people__mentors"
      v-if="assignedWorkStore.assignedWork.work?.type !== 'test'"
    >
      <label>Проверяющие кураторы: </label>
      <user-card
        v-for="mentor in assignedWorkStore.assignedWork.mentors"
        :user="mentor"
        :key="mentor.id"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAssignedWorkStore } from '../../stores/assigned-work'

const assignedWorkStore = useAssignedWorkStore()
</script>

<style lang="sass" scoped>
.work-people
	margin-top: 1em

	label
		color: var(--text-light)

	&__student
		margin-bottom: 1em
		font-size: 0.8em

	&__mentors
		font-size: 0.8em
</style>
