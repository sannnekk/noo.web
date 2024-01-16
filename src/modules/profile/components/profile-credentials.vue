<template>
  <div class="profile-credentials">
    <div class="profile-credentials__avatar">
      <user-avatar
        :src="credentialsModel.avatar"
        :name="credentialsModel.name"
      />
    </div>
    <div class="profile-credentials__name">
      <inline-input
        @update:modelValue="onSomeInputChange()"
        v-model="credentialsModel.name"
      />
    </div>
    <div class="profile-credentials__username">
      <inline-input
        @update:modelValue="onSomeInputChange()"
        v-model="credentialsModel.username"
      />
    </div>
    <div class="profile-credentials__email">
      <inline-input
        @update:modelValue="onSomeInputChange()"
        v-model="credentialsModel.email"
      />
    </div>
    <div class="profile-credentials__role">
      <role-tag :role="credentialsModel.role" />
    </div>
    <div
      class="profile-credentials__save-button"
      v-auto-animate
    >
      <common-button
        v-if="isChanged"
        alignment="center"
        @click="$emit('save')"
      >
        Сохранить
      </common-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/entities/User'
import { ref, computed } from 'vue'

interface Props {
  modelValue: User
}

interface Emits {
  (e: 'update:modelValue', value: User): void
  (e: 'save'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const credentialsModel = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})

const isChanged = ref(false)

function onSomeInputChange() {
  isChanged.value = true
}
</script>

<style scoped lang="sass">
.profile-credentials
  text-align: center

  &__avatar
    display: inline-block
    font-size: 180px

  &__name
    margin-top: 1em

    input
      font-weight: 500
      font-size: 1.2em
      text-align: center

  &__username
    margin-top: 0.5em

    input
      text-align: center

  &__role
    margin-top: 0.5em

  &__save-button
    margin-top: 1em
    margin-bottom: 1em

  &__email
    input
      text-align: center
</style>
