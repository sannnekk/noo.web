<template>
  <div
    class="auth-form"
    v-auto-animate
  >
    <div
      class="auth-form__inner"
      v-if="modeModel === 'login'"
    >
      <div class="auth-form__group">
        <text-input
          v-model.trim="loginModel.usernameOrEmail"
          placeholder="Email или никнейм"
          @enter-press="onLogin()"
        />
      </div>
      <div class="auth-form__group">
        <text-input
          v-model="loginModel.password"
          placeholder="Пароль"
          @enter-press="onLogin()"
          password
        />
      </div>
      <div class="auth-form__group">
        <error-block v-if="error">{{ error }}</error-block>
      </div>
      <div class="auth-form__group">
        <div class="auth-form__group__login">
          <common-button
            contrast
            alignment="center"
            :loading="isLoading"
            @click="onLogin()"
          >
            Войти
          </common-button>
        </div>
        <div class="auth-form__group__register">
          <span @click="modeModel = 'register'"> Зарегистрироваться </span>
          <span @click="modeModel = 'forgot-password'"> Забыли пароль? </span>
        </div>
      </div>
    </div>
    <div
      class="auth-form__inner"
      v-else-if="modeModel === 'register'"
    >
      <div class="auth-form__group">
        <text-input
          v-model.trim="registerModel.name"
          placeholder="Имя и фамилия"
          @enter-press="onRegister()"
        />
      </div>
      <div class="auth-form__group">
        <text-input
          v-model.trim="registerModel.email"
          placeholder="Email"
          @enter-press="onRegister()"
        />
      </div>
      <div
        class="auth-form__group"
        v-auto-animate
      >
        <text-input
          v-model.trim="registerModel.username"
          placeholder="Никнейм"
          @enter-press="onRegister()"
        />
        <username-validation
          :username="registerModel.username"
          v-model:valid="registerModel.usernameIsValid"
        />
      </div>
      <div class="auth-form__group">
        <text-input
          v-model="registerModel.password"
          placeholder="Пароль"
          @enter-press="onRegister()"
          password
        />
        <password-criteria
          :password="registerModel.password"
          v-model="registerModel.passwordIsCorrect"
        />
      </div>
      <div class="auth-form__group">
        <text-input
          v-model="registerModel.repeatPassword"
          placeholder="Повторите пароль"
          @enter-press="onRegister()"
          password
        />
      </div>
      <div class="auth-form__group">
        <error-block v-if="error">{{ error }}</error-block>
      </div>
      <div class="auth-form__group">
        <div class="auth-form__group__login">
          <common-button
            contrast
            alignment="center"
            :loading="isLoading"
            @click="onRegister()"
          >
            Зарегистрироваться
          </common-button>
        </div>
        <div class="auth-form__group__register">
          <span @click="modeModel = 'login'"> Войти </span>
          <br />
          <span @click="modeModel = 'resend-verification'">
            Отправить подтверждение заново
          </span>
        </div>
      </div>
    </div>
    <div
      class="auth-form__inner"
      v-else-if="modeModel === 'forgot-password'"
    >
      <div class="auth-form__group">
        <text-input
          v-model.trim="forgotPasswordModel.email"
          placeholder="Почта"
          @enter-press="onForgotPassword()"
        />
      </div>
      <div class="auth-form__group">
        <error-block v-if="error">{{ error }}</error-block>
      </div>
      <div class="auth-form__group">
        <div class="auth-form__group__login">
          <common-button
            contrast
            alignment="center"
            :loading="isLoading"
            @click="onForgotPassword()"
          >
            Сбросить пароль
          </common-button>
        </div>
        <div class="auth-form__group__register">
          <span @click="modeModel = 'login'"> Войти </span>
          <span @click="modeModel = 'register'"> Зарегистрироваться </span>
          <br />
          <span @click="modeModel = 'resend-verification'">
            Отправить подтверждение заново
          </span>
        </div>
      </div>
    </div>
    <div
      class="auth-form__inner"
      v-else
    >
      <div class="auth-form__group">
        <text-input
          v-model.trim="resendVerificationModel.email"
          placeholder="Почта"
          @enter-press="onResendVerification()"
        />
      </div>
      <div class="auth-form__group">
        <error-block v-if="error">{{ error }}</error-block>
      </div>
      <div class="auth-form__group">
        <div class="auth-form__group__login">
          <common-button
            contrast
            alignment="center"
            :loading="isLoading"
            @click="onResendVerification()"
          >
            Отправить
          </common-button>
        </div>
        <div class="auth-form__group__register">
          <span @click="modeModel = 'login'"> Войти </span>
          <span @click="modeModel = 'register'"> Зарегистрироваться </span>
          <span @click="modeModel = 'forgot-password'"> Забыли пароль? </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  authCredentials: {
    usernameOrEmail: string
    password: string
  }
  registerCredentials: {
    name: string
    username: string
    email: string
    password: string
    repeatPassword: string
    passwordIsCorrect: boolean
    usernameIsValid: boolean
  }
  forgotPasswordCredentials: {
    email: string
  }
  resendVerificationCredentials: {
    email: string
  }
  mode: 'login' | 'register' | 'forgot-password' | 'resend-verification'
  isLoading?: boolean
  error?: string
}

interface Emits {
  (e: 'update:authCredentials', value: Props['authCredentials']): void
  (e: 'update:registerCredentials', value: Props['registerCredentials']): void
  (
    e: 'update:forgotPasswordCredentials',
    value: Props['forgotPasswordCredentials']
  ): void
  (
    e: 'update:resendVerificationCredentials',
    value: Props['resendVerificationCredentials']
  ): void
  (e: 'update:mode', value: Props['mode']): void
  (e: 'login'): void
  (e: 'register'): void
  (e: 'forgot-password'): void
  (e: 'resend-verification'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const modeModel = computed({
  get: () => props.mode,
  set: (val) => emits('update:mode', val)
})

const loginModel = computed({
  get: () => props.authCredentials,
  set: (val) => emits('update:authCredentials', val)
})

const registerModel = computed({
  get: () => props.registerCredentials,
  set: (val) => emits('update:registerCredentials', val)
})

const forgotPasswordModel = computed({
  get: () => props.forgotPasswordCredentials,
  set: (val) => emits('update:forgotPasswordCredentials', val)
})

const resendVerificationModel = computed({
  get: () => props.resendVerificationCredentials,
  set: (val) => emits('update:resendVerificationCredentials', val)
})

function onLogin() {
  emits('login')
}

function onRegister() {
  emits('register')
}

function onForgotPassword() {
  emits('forgot-password')
}

function onResendVerification() {
  emits('resend-verification')
}
</script>

<style lang="sass" scoped>
.auth-form
  max-height: 65vh
  overflow-y: auto

  &__inner
    @media screen and (max-width: 768px)
      height: unset
      max-height: unset

  @media screen and (max-width: 768px)
    height: unset
    max-height: unset
    padding-bottom: 4em

  &__group
    margin-bottom: 1em

    &__register
      display: flex
      flex-wrap: wrap
      justify-content: center
      align-items: center
      gap: 1em
      margin-top: 1em
      font-size: 12px
      color: var(--dark)
      text-decoration: none
      cursor: pointer

      span
        &:hover
          text-decoration: underline
</style>
