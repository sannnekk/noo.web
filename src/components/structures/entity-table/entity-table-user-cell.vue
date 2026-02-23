<template>
  <div class="user-cell">
    <p class="user-cell__name">
      {{ value?.verificationToken ? '❌' : '' }}
      {{ value?.name || '-' }}
    </p>
    <div
      class="user-cell__mentors"
      v-if="
        value &&
        value?.role === 'student' &&
        value.mentorAssignmentsAsStudent?.length
      "
    >
      <div class="user-cell__mentors__mentor">
        <small> Кураторы: </small>
      </div>
      <div
        class="user-cell__mentors__mentor"
        v-for="assignment in value.mentorAssignmentsAsStudent"
        :key="assignment.id"
      >
        <small>
          <span
            class="user-cell__mentors__mentor__subject-badge"
            :style="{ backgroundColor: assignment.subject.color }"
          ></span>
          {{ assignment.mentor.name }}
        </small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/core/data/entities/User'

interface Props {
  value?: User
}

defineProps<Props>()
</script>

<style lang="sass" scoped>
.user-cell
	display: flex
	flex-direction: column
	justify-content: center
	row-gap: 1em
	column-gap: 0

	&__name
		margin: 0

	&__mentors
		display: flex
		flex-direction: column
		flex-wrap: wrap
		row-gap: 0
		margin-top: -1em

		&__mentor
			&__subject-badge
				position: relative
				top: -0.1em
				width: 0.3em
				height: 0.8em
				display: inline-block
				vertical-align: middle
</style>
