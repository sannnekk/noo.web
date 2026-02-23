<template>
  <div class="online-status">
    <div
      class="online-status__icon"
      :class="{ 'online-status__icon--online': props.isOnline }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="8"
        />
      </svg>
    </div>
    <div class="online-status__text">
      {{ props.isOnline ? 'Онлайн' : `Был(а) в сети ${lastSeenAt}` }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDate } from '@/composables/useDate'
import { computed } from 'vue'

interface Props {
  isOnline: boolean
  lastSeen: Date | null
  isMobile: boolean
}

const props = defineProps<Props>()

const lastSeenAt = computed(() => {
  if (!props.lastSeen) {
    return 'давно'
  }

  return useDate(props.lastSeen, { precision: 'minute' }).toBeautiful()
})
</script>

<style scoped lang="sass">
.online-status
	display: flex
	align-items: center
	font-size: 0.75em

	&__icon
		margin-right: 0.5em
		position: relative
		top: 0.2em

		svg
			fill: var(--border-color)

		&--online
			svg
				fill: var(--success)

	&__text
		color: var(--form-text-color)
</style>
