<template>
  <form
    class="auth-form register-form"
    @submit.prevent="authStore.register()"
    v-auto-animate
  >
    <text-input
      v-model.trim="credentials.name"
      label="Имя и фамилия"
      placeholder="Иван Иванов"
    />
    <text-input
      v-model.trim="credentials.email"
      label="Email"
      placeholder="user@gmail.com"
    />
    <div
      class="register-form__field"
      v-auto-animate
    >
      <text-input
        v-model.trim="credentials.username"
        label="Никнейм"
        placeholder="ivanivanov123"
      />
      <username-validation
        :username="credentials.username"
        v-model:valid="credentials.usernameIsValid"
      />
    </div>
    <text-input
      v-model.trim="credentials.telegramUsername"
      label="Телеграм"
      placeholder="ivan_ivanov"
    />
    <div class="register-form__field">
      <text-input
        v-model="credentials.password"
        label="Пароль"
        placeholder="Пароль"
        password
      />
      <password-criteria
        :password="credentials.password"
        v-model="credentials.passwordIsCorrect"
      />
    </div>
    <text-input
      v-model="credentials.repeatPassword"
      label="Повторите пароль"
      placeholder="Повторите пароль"
      password
    />
    <form-checkbox
      v-model="isRightsAccepted"
      label=""
    >
      Я даю согласие на обработку моих персональных данных в порядке и на
      условиях, указанных в
      <a
        href="https://www.no-os.ru/agreement"
        target="_blank"
        rel="noopener noreferrer"
      >
        Политике обработки персональных данных
      </a>
    </form-checkbox>
    <error-block v-if="authStore.error">{{ authStore.error }}</error-block>
    <common-button
      type="submit"
      alignment="stretch"
      contrast
      :disabled="!isRightsAccepted"
      :loading="authStore.isLoading"
    >
      Зарегистрироваться
    </common-button>
    <auth-form-links
      :links="[
        { to: '/auth', label: 'Войти' },
        {
          to: '/auth/resend-verification',
          label: 'Отправить подтверждение заново'
        }
      ]"
    />
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthFormLinks from './auth-form-links.vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const credentials = authStore.registerCredentials

const isRightsAccepted = ref(false)
</script>

<style lang="sass" scoped>
.register-form
  // A field plus the validation feedback that belongs to it
  &__field
    display: flex
    flex-direction: column
    gap: 0.5rem

  :deep(.form-checkbox__label)
    align-items: flex-start
    line-height: 1.4

  :deep(.form-checkbox__box)
    margin-top: 0.1rem

  :deep(.form-checkbox a)
    text-decoration: underline
</style>
