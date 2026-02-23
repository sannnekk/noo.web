<template>
  <div class="form-color-select">
    <label class="form-color-select__label">{{ label }}</label>
    <div class="form-color-select__select">
      <div
        class="form-color-select__select__color form-color-select__select__no-color"
        :class="{
          'form-color-select__select__color--selected': model === null
        }"
        @click="model = null"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line
            x1="18"
            y1="6"
            x2="6"
            y2="18"
          ></line>
          <line
            x1="6"
            y1="6"
            x2="18"
            y2="18"
          ></line>
        </svg>
      </div>
      <div
        class="form-color-select__select__color"
        :class="{
          'form-color-select__select__color--selected': model === color
        }"
        v-for="color in colors"
        :key="color"
        :style="{ background: color }"
        @click="model = color"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string | null
  allowEmpty?: boolean
  label: string
}

interface Emits {
  (event: 'update:modelValue', value: string | null): void
}

const colors: string[] = [
  'var(--primary)',
  'var(--secondary)',
  'var(--success)',
  'var(--danger)',
  'var(--warning)',
  'var(--info)'
]

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})
</script>

<style scoped lang="sass">
.form-color-select
	display: flex
	flex-direction: column
	gap: 8px

	&__label
		font-size: 0.8em
		color: var(--text-light)

	&__select
		display: flex
		gap: 0.8em

		&__color
			width: 24px
			height: 24px
			border-radius: 50%
			cursor: pointer
			border: 1px solid transparent
			outline-offset: 2px

			&--selected
				outline: 1px solid var(--primary)

		&__no-color
			background: var(--light-background-color)
			display: flex
			justify-content: center
			align-items: center
</style>
