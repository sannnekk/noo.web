<template>
  <div class="horizontal-selection">
    <div
      class="horizontal-selection__option"
      :class="{ 'horizontal-selection__option--selected': model === option }"
      v-for="option in options"
      :key="option"
      @click="model = option"
    >
      {{ option }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  options: string[]
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (value: string) => emits('update:modelValue', value)
})
</script>

<style scoped lang="sass">
.horizontal-selection
	display: flex
	border: 1px solid var(--border-color)
	border-radius: var(--border-radius)
	overflow: hidden
	width: fit-content

	&__option
		padding: 0.5em 0.7em
		display: flex
		align-items: center
		justify-content: center
		color: var(--form-text-color)
		cursor: pointer

		&:not(:last-child)
			border-right: 1px solid var(--border-color)

		&--selected
			background-color: var(--lila)
			color: var(--form-background)
			font-weight: bold

		&:not(&--selected):hover
			background-color: var(--border-color)
</style>
