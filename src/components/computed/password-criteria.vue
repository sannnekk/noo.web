<template>
  <div class="password-criteria">
    <span
      v-for="criterium in Core.Services.User.passwordCriteria()"
      class="password-criteria__item"
    >
      <inline-icon
        :name="criterium.isValid(password) ? 'check-green' : 'cross-red'"
      />
      {{ criterium.label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'

interface Props {
  password: string
}

defineProps<Props>()
</script>

<style scoped lang="sass">
.password-criteria
  margin-top: 0.5em
  font-size: 12px
  background-color: var(--lightest)
  border-radius: var(--border-radius)
  padding: 1em

  &__item
    display: block
</style>
