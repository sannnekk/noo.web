<template>
  <div
    class="entity-selection-card"
    :class="{ 'entity-selection-card--selected': selected }"
    @mouseenter="animation = true"
    @mouseleave="animation = false"
  >
    <div
      class="entity-selection-card__selected-badge"
      v-if="selected"
    ></div>
    <div class="entity-selection-card__icon">
      <inline-icon
        :name="entity.icon"
        :animation="animation"
      />
    </div>
    <div class="entity-selection-card__name">
      <p>
        {{ entity.name }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SupportedEntity } from '../types/SupportedEntity'

interface Props {
  entity: SupportedEntity
  selected?: boolean
}

defineProps<Props>()

const animation = ref(false)
</script>

<style scoped lang="sass">
.entity-selection-card
	display: flex
	flex-direction: column
	align-items: center
	justify-content: center
	padding: 1em
	border-radius: var(--border-radius)
	border: 1px solid var(--border-color)
	cursor: pointer
	transition: background-color 0.2s
	width: min(50%, 160px)
	position: relative

	&:not(&--selected):hover
		border-color: var(--primary)

	&--selected
		border-color: var(--secondary)

	&__selected-badge
		position: absolute
		top: 0.3em
		right: 0.3em
		background-color: var(--secondary)
		width: 1em
		height: 1em
		border-radius: 50%

	&__icon
		font-size: 3em
		width: 2em
		height: 2em
		display: flex
		justify-content: center
		align-items: center

	&__name
		text-align: center
		font-size: 0.9em
		height: 4em
</style>
