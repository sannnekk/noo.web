<template>
  <label сlass="rating-input">
    <span class="rating-input__label">{{ label }}</span>
    <div class="rating-input__input">
      <input
        class="rating-input__input__field"
        type="range"
        :min="minRating"
        :max="maxRating"
        :step="onlyIntegers ? 1 : 0.25"
        v-model="model"
        :disabled="readonly"
      />
      <span class="rating-input__input__value">{{ model }}</span>
    </div>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  modelValue: number | string
  readonly?: boolean
  minRating?: number
  maxRating?: number
  onlyIntegers?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: number): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (value) =>
    emits(
      'update:modelValue',
      props.onlyIntegers
        ? parseInt(value as string)
        : parseFloat(value as string)
    )
})
</script>

<style scoped lang="sass">
.rating-input
	&__label
		font-size: 0.8rem
		color: var(--text-light)

	&__input
		display: flex

		&__field
			flex: 1
			margin-top: 0.5em
			-webkit-appearance: none
			background-color: var(--border-color)
			border: none

		&__value
			margin-left: 0.5em
			font-size: 0.8rem
			color: var(--text-light)
</style>
