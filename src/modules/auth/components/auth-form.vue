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
          v-model="loginModel.username"
          placeholder="Логин"
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
        </div>
      </div>
    </div>
    <div
      class="auth-form__inner"
      v-else
    >
      <div class="auth-form__group">
        <text-input
          v-model="registerModel.name"
          placeholder="Имя и фамилия"
          @enter-press="onRegister()"
        />
      </div>
      <div class="auth-form__group">
        <text-input
          v-model="registerModel.email"
          placeholder="Email"
          @enter-press="onRegister()"
        />
      </div>
      <div class="auth-form__group">
        <text-input
          v-model="registerModel.username"
          placeholder="Никнейм"
          @enter-press="onRegister()"
        />
      </div>
      <div class="auth-form__group">
        <text-input
          v-model="registerModel.password"
          placeholder="Пароль"
          @enter-press="onRegister()"
          password
        />
        <div class="auth-form__group__password-criteria">
          <span
            v-for="criterium in registerCredentials.passwordCriteria"
            class="auth-form__group__password-criteria__item"
          >
            <inline-icon
              :name="
                criterium.isValid(registerCredentials.password)
                  ? 'check-green'
                  : 'cross-red'
              "
            />
            {{ criterium.errorText }}
          </span>
        </div>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  authCredentials: {
    username: string
    password: string
  }
  registerCredentials: {
    name: string
    username: string
    email: string
    password: string
    repeatPassword: string
    passwordCriteria: {
      errorText: string
      isValid: (str: string) => boolean
    }[]
  }
  mode: 'login' | 'register'
  isLoading?: boolean
  error?: string
}

interface Emits {
  (e: 'update:authCredentials', value: Props['authCredentials']): void
  (e: 'update:registerCredentials', value: Props['registerCredentials']): void
  (e: 'update:mode', value: Props['mode']): void
  (e: 'login'): void
  (e: 'register'): void
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

function onLogin() {
  emits('login')
}

function onRegister() {
  emits('register')
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

    &__password-criteria
      margin-top: 0.5em
      font-size: 12px
      background-color: var(--lightest)
      border-radius: var(--border-radius)
      padding: 1em

      &__item
        display: block

    &__register
      text-align: center
      margin-top: 1em
      font-size: 12px
      color: var(--dark)
      text-decoration: none
      cursor: pointer

      &:hover
        text-decoration: underline
</style>
