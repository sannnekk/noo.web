<template>
  <div
    class="password-change-form"
    v-auto-animate
  >
    <div class="password-change-form__form-field">
      <form-input
        v-model="form.oldPassword"
        type="password"
        label="Старый пароль"
      />
    </div>
    <div class="password-change-form__form-field">
      <form-input
        v-model="form.newPassword"
        type="password"
        label="Новый пароль"
      />
    </div>
    <div class="password-change-form__validation">
      <password-criteria
        :password="form.newPassword"
        v-model="form.passwordIsCorrect"
      />
    </div>
    <div class="password-change-form__form-field">
      <form-input
        v-model="form.repeatPassword"
        type="password"
        label="Повторите новый пароль"
      />
    </div>
    <div
      class="password-change-form__error"
      v-if="error"
    >
      <error-block>
        {{ error }}
      </error-block>
    </div>
    <div class="password-change-form__form-action">
      <common-button
        design="primary"
        @click="onSubmit()"
        alignment="left"
      >
        Сохранить
      </common-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { PasswordChangeForm } from '../../types/account/PasswordChangeForm'

interface Emits {
  (e: 'change-password', value: PasswordChangeForm): void
}

const emits = defineEmits<Emits>()

const form = reactive<PasswordChangeForm>({
  oldPassword: '',
  newPassword: '',
  repeatPassword: '',
  passwordIsCorrect: false
})

const error = ref<string | null>(null)

function onSubmit() {
  if (form.newPassword !== form.repeatPassword) {
    error.value = 'Пароли не совпадают'
  }

  if (form.passwordIsCorrect) {
    error.value = null
    emits('change-password', form)
  } else {
    error.value = 'Пароль не соответствует требованиям'
  }
}
</script>

<style lang="sass" scoped>
.password-change-form
	&__form-field
		width: min(500px, 100%)

	&__form-action
		margin-top: 1em
</style>
