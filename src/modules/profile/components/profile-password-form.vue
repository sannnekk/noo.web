<template>
  <div class="profile-password-form">
    <div class="profile-password-form__header">
      <h3 class="profile-password-form__header__title">Смена пароля</h3>
    </div>
    <div class="profile-password-form__form">
      <div class="profile-password-form__form__field">
        <form-input
          type="password"
          label="Старый пароль"
          v-model="model.oldPassword"
        />
      </div>
      <div class="profile-password-form__form__field">
        <form-input
          type="password"
          label="Новый пароль"
          v-model="model.newPassword"
        />
        <password-criteria :password="model.newPassword" />
      </div>
      <div class="profile-password-form__form__field">
        <form-input
          type="password"
          label="Повторите новый пароль"
          v-model="model.repeatPassword"
        />
      </div>
      <div class="profile-password-form__form__field">
        <common-button
          alignment="center"
          @click="$emit('save')"
        >
          Сменить пароль
        </common-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PasswordChangeForm } from '../types/PasswordChangeForm'

interface Props {
  modelValue: PasswordChangeForm
}

interface Emits {
  (e: 'update:modelValue', value: PasswordChangeForm): void
  (e: 'save'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})
</script>

<style scoped lang="sass">
.profile-password-form
  text-align: center

  &__form
    &__field
      margin-bottom: 1em

      input
        text-align: center
</style>
