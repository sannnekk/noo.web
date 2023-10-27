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
      <status-tag
        :type="userType"
        mode="background"
        >{{ userRole }}</status-tag
      >
    </div>
    <div
      class="profile-credentials__save-button"
      v-auto-animate
    >
      <common-button
        v-if="isChanged"
        alignment="center"
        @click="() => {}"
      >
        Сохранить
      </common-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/entities/User'
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue: User
}

interface Emits {
  (e: 'update:modelValue', value: User): void
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

const userRole = computed(() => {
  switch (credentialsModel.value.role) {
    case 'admin':
      return 'Администратор'
    case 'teacher':
      return 'Учитель'
    case 'mentor':
      return 'Куратор'
    case 'student':
    default:
      return 'Ученик'
  }
})

const userType = computed(() => {
  switch (credentialsModel.value.role) {
    case 'admin':
      return 'danger'
    case 'teacher':
      return 'warning'
    case 'mentor':
      return 'success'
    case 'student':
    default:
      return 'info'
  }
})
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
