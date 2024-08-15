<template>
  <div
    class="unbind-telegram-form"
    v-if="props.telegramUsername || props.telegramId"
  >
    <p class="unbind-telegram-form__hint">
      <span v-if="props.telegramUsername">
        К Вашему аккаунту привязан Telegram аккаунт
        <b>@{{ props.telegramUsername }}</b>
      </span>
      <span v-else>
        К Вашему аккаунту привязан Telegram аккаунт, <br />
        но настройки конфиденциальности Telegram не позволяют <br />
        получить информацию о пользователе. <br />
        Вам доступна функция уведомлений, <br />
        но ваши данные не будут отображены в профиле.
      </span>
    </p>
    <div class="unbind-telegram-form__unbind-button">
      <common-button
        @click="onUnbind()"
        design="danger"
        alignment="left"
      >
        Отвязать Telegram
      </common-button>
    </div>
  </div>
  <div
    class="bind-telegram-form"
    v-else
  >
    <p class="bind-telegram-form__hint">
      После привязки Telegram платформа будет использовать Ваше фото из Telegram
      (это можно поменять при смене аватара), Ваш Telegram ID для уведомлений.
      Кураторы и преподаватели смогут видеть ваш Telegram аккаунт в Вашем
      профиле.
    </p>
    <div class="bind-telegram-form__bind-button">
      <telegram-auth-button @authenticated="onAuthenticated($event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { TelegramUpdatePayload } from '@/core/services/api/UserService'

interface Props {
  telegramUsername?: string
  telegramId?: string
}

interface Emits {
  (event: 'bind', value: TelegramUpdatePayload): void
  (event: 'unbind'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const uiService = Core.Services.UI

function onAuthenticated(data: any) {
  if (!data.id) {
    uiService.openErrorModal(
      'Не удалось привязать Telegram',
      'Попробуйте еще раз'
    )
    return
  }

  setTimeout(() => {
    emits('bind', {
      telegramId: String(data.id),
      telegramUsername: data.username,
      telegramAvatarUrl: data.photo_url
    })
  }, 100)
}

function onUnbind() {
  emits('unbind')
}
</script>

<style scoped lang="sass">
.unbind-telegram-form
  &__hint
    color: var(--text-light)

    b
      color: var(--secondary)

.bind-telegram-form
  &__hint
    color: var(--text-light)
</style>
