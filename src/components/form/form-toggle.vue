<template>
  <div class="form-toggle">
    <div
      class="form-toggle__box"
      :class="{ 'form-toggle__box--active': model }"
      @click="toggle()"
    >
      <div
        class="form-toggle__circle"
        :class="{ 'form-toggle__circle--active': model }"
      ></div>
    </div>
    <span>{{ text.label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue: string
  values: [
    {
      value: any
      label: string
    },
    {
      value: any
      label: string
    }
  ]
}

interface Emits {
  (e: 'update:modelValue', value: any): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = ref(props.modelValue === props.values[1].value)
const text = computed(() => (model.value ? props.values[1] : props.values[0]))

function toggle() {
  model.value = !model.value
  emits('update:modelValue', text.value.value)
}
</script>

<style scoped lang="sass">
.form-toggle
  display: flex
  align-items: center
  cursor: pointer

  &__box
    position: relative
    width: 2.3em
    height: 1.3em
    border: 1px solid var(--border-color)
    border-radius: 1em
    margin-right: 0.3em
    transition: background-color 0.3s
    background-color: var(--form-background)

    &:hover
      background-color: var(--light)

    &--active
      background-color: var(--light)

  &__circle
    position: absolute
    top: 0.07em
    left: 0.1em
    width: 1em
    height: 1em
    border-radius: 50%
    background-color: var(--form-text-color)
    transition: left 0.3s

    &--active
      left: 1.1em
      background-color: var(--secondary)

  label
    display: flex
    align-items: center
    color: var(--form-text-color)
    font-size: 0.8em
</style>
