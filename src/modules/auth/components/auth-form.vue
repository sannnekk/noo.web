<template>
  <div
    class="auth-form"
    v-auto-animate
  >
    <div
      class="auth-form__inner"
      v-if="mode === 'login'"
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

        <div class="auth-form__group__or">или</div>
        <div class="auth-form__group__register-button">
          <common-button
            contrast
            alignment="center"
            :disabled="isLoading"
            to="/auth/register"
          >
            Зарегистрироваться
          </common-button>
        </div>
        <div class="auth-form__group__register">
          <router-link to="/auth/forgot-password"> Забыли пароль? </router-link>
        </div>
      </div>
    </div>
    <div
      class="auth-form__inner"
      v-else-if="mode === 'register'"
    >
      <div class="auth-form__group">
        <text-input
          v-model.trim="registerModel.name"
          label="Имя и фамилия"
          placeholder="Иван Иванов"
          @enter-press="onRegister()"
        />
      </div>
      <div class="auth-form__group">
        <text-input
          label="Email"
          v-model.trim="registerModel.email"
          placeholder="user@gmail.com"
          @enter-press="onRegister()"
        />
      </div>
      <div
        class="auth-form__group"
        v-auto-animate
      >
        <text-input
          label="Никнейм"
          v-model.trim="registerModel.username"
          placeholder="ivanivanov123"
          @enter-press="onRegister()"
        />
        <username-validation
          :username="registerModel.username"
          v-model:valid="registerModel.usernameIsValid"
        />
      </div>
      <div class="auth-form__group">
        <text-input
          label="Номер телефона"
          v-model.trim="registerModel.phone"
          placeholder="+7 (999) 999-99-99"
          @enter-press="onRegister()"
        />
      </div>
      <div class="auth-form__group">
        <text-input
          label="Телеграм"
          v-model.trim="registerModel.telegram"
          placeholder="ivan_ivanov"
          @enter-press="onRegister()"
        />
      </div>
      <div class="auth-form__group">
        <text-input
          label="Пароль"
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
          label="Повторите пароль"
          v-model="registerModel.repeatPassword"
          placeholder="Повторите пароль"
          @enter-press="onRegister()"
          password
        />
      </div>
      <div class="auth-form__group">
        <form-checkbox v-model="isRightsAccepted">
          Я даю Согласие на обработку моих персональных данных в порядке и на
          условиях, указанных в
          <a
            href="https://www.no-os.ru/agreement"
            target="_blank"
            rel="noopener noreferrer"
          >
            Политике обработки персональных данных и Публичной оферте</a
          >
        </form-checkbox>
      </div>
      <div class="auth-form__group">
        <error-block v-if="error">{{ error }}</error-block>
      </div>
      <div class="auth-form__group">
        <div class="auth-form__group__login">
          <common-button
            contrast
            alignment="center"
            :disabled="!isRightsAccepted"
            :loading="isLoading"
            @click="onRegister()"
          >
            Зарегистрироваться
          </common-button>
        </div>
        <div class="auth-form__group__register">
          <router-link to="/auth"> Войти </router-link>
          <br />
          <router-link to="/auth/resend-verification">
            Отправить подтверждение заново
          </router-link>
        </div>
      </div>
    </div>
    <div
      class="auth-form__inner"
      v-else-if="mode === 'forgot-password'"
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
          <router-link to="/auth"> Войти </router-link>
          <router-link to="/auth/register"> Зарегистрироваться </router-link>
          <br />
          <router-link to="/auth/resend-verification">
            Отправить подтверждение заново
          </router-link>
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
          <router-link to="/auth"> Войти </router-link>
          <router-link to="/auth/register"> Зарегистрироваться </router-link>
          <router-link to="/auth/forgot-password"> Забыли пароль? </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

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
    phone: string
    telegram: string
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
  (e: 'login'): void
  (e: 'register'): void
  (e: 'forgot-password'): void
  (e: 'resend-verification'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const isRightsAccepted = ref(false)

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

  &__inner
    padding-bottom: 2em

    @media screen and (max-width: 768px)
      height: unset
      max-height: unset

  @media screen and (max-width: 768px)
    height: unset
    max-height: unset
    padding-bottom: 4em

  &__group
    margin-bottom: 1em

    &__or
      text-align: center
      margin-top: 0.4em
      margin-bottom: 0.4em

    &__register-button
      font-size: 1.1em

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
