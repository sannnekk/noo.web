<template>
  <component
    :is="to ? 'router-link' : 'div'"
    :to="to"
    class="inline-button"
  >
    <inline-icon :name="icon" />
    <span><slot /></span>
  </component>
</template>

<script setup lang="ts">
import type { IconName } from '../decorations/inline-icon.vue'

interface Props {
  icon: IconName
  to?: string
}

defineProps<Props>()
</script>

<style scoped lang="sass">
.inline-button
	text-decoration: none
	display: flex
	align-items: center
	gap: 0.4em
	font-size: 1em
	color: var(--text-light)
	cursor: pointer
	user-select: none

	&:hover
		color: var(--form-text-color)
</style>
