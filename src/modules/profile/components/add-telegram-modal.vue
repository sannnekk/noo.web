<template>
  <sure-modal
    v-model:visible="visibilityModel"
    @confirm="emits('confirm')"
  >
    <template #title>
      <h2>Привязка Telegram</h2>
    </template>
    <template #text>
      <p>
        После привязки Telegram платформа будет использовать Ваше фото из
        Telegram и Ваш Telegram ID для уведомлений (BETA).
      </p>
      <telegram-auth-button @authenticated="onAuthenticated($event)" />
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import type { TelegramUpdatePayload } from '@/core/services/api/UserService'
import { computed } from 'vue'

interface Props {
  visible: boolean
  authData: TelegramUpdatePayload | null
}

interface Emits {
  (event: 'update:visible', value: boolean): void
  (event: 'update:authData', value: TelegramUpdatePayload | null): void
  (event: 'confirm'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const visibilityModel = computed({
  get: () => props.visible,
  set: (value) => emits('update:visible', value)
})

const authDataModel = computed({
  get: () => props.authData,
  set: (value) => emits('update:authData', value)
})

function onAuthenticated(data: any) {
  authDataModel.value = {
    telegramId: String(data.id),
    telegramUsername: data.username,
    telegramAvatarUrl: data.photo_url
  }

  setTimeout(() => {
    emits('confirm')
  }, 100)
}
</script>

<style scoped lang="sass"></style>
