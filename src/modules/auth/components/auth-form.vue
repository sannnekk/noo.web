<template>
  <div
    class="auth-form"
    v-auto-animate
  >
    <div
      class="auth-form__inner auth-form__inner--login"
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
        <div class="auth-form__group__forgot-password">
          <router-link to="/auth/forgot-password"> Забыли пароль? </router-link>
        </div>
        <div class="auth-form__group__login-register">
          <div class="auth-form__group__login-register__row">
            <div class="auth-form__group__login-register__left">
              <p>
                Нажми «зарегистрироваться» и получи курсы подготовки к ЕГЭ и ОГЭ
                <b>бесплатно</b>
              </p>
              <div class="auth-form__group__login-register__hint">
                Прибавь от 20 баллов и выше
              </div>
            </div>
            <div class="auth-form__group__login-register__right">
              <img
                src="/vlada_asif.png"
                alt="Register faces"
              />
            </div>
          </div>
          <common-button
            :to="'/auth/register'"
            alignment="stretch"
            contrast
          >
            Зарегистрироваться
          </common-button>
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
          label="Telegram (без @)"
          placeholder="ivan_ivanov"
          v-model.trim="registerModel.telegramUsername"
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
            Политике обработки персональных данных
          </a>
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
    telegramUsername: string
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

    &--login
      :deep()
        input
          font-size: 1.1em
          padding: 1.1em 1em

    .auth-form__group__login
      display: flex
      justify-content: stretch

      &:deep() button
        width: 100%
        font-weight: 500
        padding: 1.1em 1em
        font-size: 1.1em
        text-align: center
        display: block

    .auth-form__group__forgot-password
      font-size: 1.1em
      text-align: center
      padding: 0.7em 0 1.8em 0

    .auth-form__group__login-register
      display: flex
      flex-direction: column
      align-items: center
      gap: 1em
      padding: 1em
      background: var(--lightest)
      border-radius: 1em

      @media screen and (max-width: 1520px)
        font-size: 0.75em

      @media screen and (max-width: 1520px)
        font-size: 0.7em

      @media screen and (max-width: 1240px)
        font-size: 0.65em

      @media screen and (max-width: 1240px)
        font-size: 0.60em

      &__row
        display: flex
        flex-direction: row
        align-items: center
        gap: 0em
        align-items: flex-start

        @media screen and (max-width: 1200px)
          flex-direction: column
          gap: 1em

        @media screen and (max-width: 1200px)
          flex-direction: row
          gap: 0em

      &__left
        p
          font-size: 1.3em
          margin: 0

          @media screen and (max-width: 1200px)
            font-size: 1em

      &__right
        img
          @media screen and (max-width: 1200px)
            max-width: 80px

          @media screen and (max-width: 1200px)
            max-width: 60px

      &__hint
        margin-top: 1.1em
        background: var(--secondary)
        font-weight: 600
        border-radius: 200px
        padding: 0.3em 1em
        width: fit-content

      &:deep() .v-button
        margin-top: 0.2em
        font-size: 1.2em

        a
          padding: 0.9em 1em
          font-weight: 500

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
      color: var(--dark)
      text-decoration: none
      cursor: pointer

      span
        &:hover
          text-decoration: underline
</style>
