<template>
  <div class="password-criteria">
    <span
      v-for="(criterium, index) in Core.Services.User.passwordCriteria()"
      :key="index"
      class="password-criteria__item"
    >
      <inline-icon
        :name="criterium.isValid(password) ? 'check-green' : 'cross-red'"
        :key="criterium.isValid(password) ? 'check-green' : 'cross-red'"
      />
      {{ criterium.label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import { watch } from 'vue'

interface Props {
  password: string
  modelValue: boolean
}

interface Emits {
  (event: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

watch(
  () => props.password,
  () => {
    const isValid = Core.Services.User.passwordCriteria().every((criterium) =>
      criterium.isValid(props.password)
    )

    emits('update:modelValue', isValid)
  }
)
</script>

<style scoped lang="sass">
.password-criteria
  margin-top: 0.5em
  font-size: 12px
  background-color: var(--lightest)
  border-radius: var(--border-radius)
  padding: 1em
  text-align: left

  &__item
    display: block
</style>
