<template>
  <teleport to="body">
    <div
      class="base-modal"
      :class="{ 'base-modal--visible': model.isOpen }"
      v-auto-animate
    >
      <div
        class="base-modal__inner"
        v-if="model.isOpen"
      >
        <div class="base-modal__container">
          <div
            class="base-modal__title"
            :class="`base-modal__title--warning`"
          >
            <span>Похоже, Вы вышли из системы...</span>
          </div>
          <div class="base-modal__text">
            Чтобы продолжить работу, пожалуйста, введите свои учетные данные.
          </div>
          <div class="base-modal__form">
            <form-input
              v-model="model.usernameOrEmail"
              label="Имя пользователя или email"
              placeholder="Введите имя пользователя или email"
              type="text"
              required
              readonly
            />
            <form-input
              v-model="model.password"
              label="Пароль"
              placeholder="Введите пароль"
              type="password"
              required
              @enter-press="onLogin()"
            />
          </div>
          <br />
          <p class="base-modal__auth-redirect">
            <a @click="Core.Services.Auth.logout()">
              Выйти, зарегистрироваться или сбросить пароль
            </a>
          </p>
          <error-block v-if="error">
            {{ error }}
          </error-block>
          <br />
          <slot />
          <div class="base-modal__buttons">
            <common-button
              alignment="stretch"
              @click="onLogin()"
              design="primary"
              class="base-modal__buttons__cancel"
            >
              Войти
            </common-button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import { computed, ref, watch } from 'vue'

interface Props {
  modelValue: {
    isOpen: boolean
    usernameOrEmail: string
    password: string
  }
}

interface Emits {
  (e: 'update:modelValue', value: Props['modelValue']): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (value: Props['modelValue']) => emits('update:modelValue', value)
})

const error = ref<string | null>(null)

async function onLogin() {
  Core.Services.UI.setLoading(true)

  try {
    await Core.Services.Auth.retryLogin({
      usernameOrEmail: model.value.usernameOrEmail,
      password: model.value.password
    })

    Core.Services.UI.closeModal()
    Core.Services.UI.openSuccessModal(
      'Вы снова в системе! Возможно, что-то не отображается, тогда нужно перезагрузить страницу'
    )
    emits('update:modelValue', { ...model.value, isOpen: false })
  } catch (e) {
    error.value = 'Неверный логин или пароль'
    Core.Services.UI.setLoading(false)
  } finally {
    Core.Services.UI.setLoading(false)
  }
}

watch(
  () => props.modelValue.isOpen,
  (isOpen) => {
    if (isOpen) {
      console.log('retry-login-modal: opened')
      console.log(
        'retry-login-modal: usernameOrEmail',
        Core.Context.User!.username
      )
      model.value.usernameOrEmail = Core.Context.User!.username
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="sass">
.base-modal
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: rgba(0, 0, 0, 0.5)
  z-index: 1000
  visibility: hidden

  &--visible
    visibility: visible

  &__auth-redirect
    font-size: 0.8em
    margin-top: 0
    cursor: pointer

    a
      color: var(--lila)
      text-decoration: none

      &:hover
        text-decoration: underline

  &__inner
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(0, 0, 0, 0.5)
    display: flex
    justify-content: center
    align-items: center

  &__container
    background-color: var(--lightest)
    border-radius: var(--border-radius)
    padding: 1em
    width: 90%
    max-width: 500px
    max-height: 90%
    overflow-y: auto

    &::-webkit-scrollbar
      width: 0.5em

    &::-webkit-scrollbar-track
      background-color: var(--background)

    &::-webkit-scrollbar-thumb
      background-color: var(--border-color)
      border-radius: var(--border-radius)

  &__title
    font-size: 1.2em
    font-weight: 500
    margin-bottom: 0.5em

    &--success
      color: var(--success)

    &--error
      color: var(--danger)

    &--warning
      color: var(--warning)

  &__text
    margin-bottom: 1em
    color: var(--text-light)

  &__buttons
    display: flex
    flex-direction: row
    justify-content: space-between

    &__cancel
      margin-right: 0.5em
</style>
