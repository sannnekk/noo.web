<template>
  <div class="form-checkbox">
    <label class="form-checkbox__label">
      <input
        class="form-checkbox__input"
        type="checkbox"
        :disabled="readonly"
        v-model="model"
      />
      <div
        class="form-checkbox__box"
        :class="{ 'form-checkbox__box--checked': model }"
      >
        <div
          class="form-checkbox__check"
          v-show="model"
        >
          <svg
            class="form-checkbox__check-icon"
            width="12"
            height="10"
            viewBox="0 0 12 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 5L4 8L11 1"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <span class="form-checkbox__text">
        {{ label }}
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
  label: string
  readonly?: boolean
}

interface Emits {
  (event: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})
</script>

<style scoped lang="sass">
.form-checkbox
  user-select: none

  &__label
    display: flex
    align-items: center
    color: var(--form-text-color)
    font-size: 0.9em
    cursor: pointer

  &__box
    width: 20px
    height: 20px
    border: 1px solid var(--text-light)
    border-radius: 4px
    margin-right: 10px
    display: inline-flex
    align-items: center
    justify-content: center

    &--checked
      background-color: var(--secondary)
      border-color: var(--secondary)

  &__input
    display: none
</style>
