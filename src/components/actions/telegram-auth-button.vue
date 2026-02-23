<template>
  <div class="telegram-auth-button">
    <component
      v-once
      :is="'script'"
      async
      src="https://telegram.org/js/telegram-widget.js?22"
      data-telegram-login="noo_platforma_bot"
      :data-size="size"
      data-onauth="onAuthenticated(user)"
      data-request-access="write"
    />
  </div>
</template>

<script setup lang="ts">
interface TelegramAuthResponse extends Record<string, unknown> {
  id: number
  first_name: string
  last_name: string
  username: string
  photo_url: string
  hash: string
}

interface Props {
  size?: 'small' | 'medium' | 'large'
}

interface Emits {
  (e: 'authenticated', response: TelegramAuthResponse): void
}

withDefaults(defineProps<Props>(), {
  size: 'medium'
})
const emits = defineEmits<Emits>()

// @ts-ignore
window.onAuthenticated = (user: TelegramAuthResponse) => {
  emits('authenticated', user)
}
</script>
