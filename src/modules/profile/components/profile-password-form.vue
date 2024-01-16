<template>
  <div class="profile-password-form">
    <div class="profile-password-form__header">
      <h3 class="profile-password-form__header__title">Смена пароля</h3>
    </div>
    <div class="profile-password-form__form">
      <div class="profile-password-form__form__field">
        <text-input
          type="password"
          placeholder="Старый пароль"
          v-model="oldPassword"
        />
      </div>
      <div class="profile-password-form__form__field">
        <text-input
          type="password"
          placeholder="Новый пароль"
          v-model="newPassword"
        />
      </div>
      <div class="profile-password-form__form__field">
        <text-input
          type="password"
          placeholder="Повторите новый пароль"
          v-model="newPassword2"
        />
      </div>
      <div class="profile-password-form__form__field">
        <common-button
          alignment="center"
          @click="onSave()"
        >
          Сменить пароль
        </common-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Emits {
  (e: 'save', value: string): void
}

const emits = defineEmits<Emits>()

const oldPassword = ref('')
const newPassword = ref('')
const newPassword2 = ref('')

function onSave() {
  if (newPassword.value !== newPassword2.value) {
    alert('Пароли не совпадают')
    return
  }

  emits('save', newPassword.value)
}
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
