<template>
  <div
    class="work-people"
    v-if="assignedWorkStore.assignedWork"
  >
    <div class="work-people__student">
      <label>Ученик: </label>
      <div class="work-people__student__user">
        <user-card :user="assignedWorkStore.assignedWork.student!" />
      </div>
    </div>
    <div
      class="work-people__mentors"
      v-if="assignedWorkStore.assignedWork.work?.type !== 'test'"
    >
      <label>Проверяющие кураторы: </label>
      <div
        class="work-people__mentors__mentor"
        v-for="mentor in assignedWorkStore.assignedWork.mentors"
        :key="mentor.id"
      >
        <user-card :user="mentor" />
      </div>
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

		&__user
			margin-top: 0.5em

	&__mentors
		font-size: 0.8em

		&__mentor
			margin-top: 0.5em
</style>
