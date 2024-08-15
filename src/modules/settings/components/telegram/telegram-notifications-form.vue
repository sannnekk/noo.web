<template>
  <div
    class="telegram-notifications-form"
    v-if="telegramId"
  >
    Telegram binding form
  </div>
  <div
    class="telegram-notifications-form__telegram-not-bound"
    v-else
  >
    <warning-block>
      Telegram не привязан. <br />
      Для использования уведомлений в Telegram необходимо привязать аккаунт.
    </warning-block>
  </div>
</template>

<script setup lang="ts">
interface Props {
  telegramId?: string
}

defineProps<Props>()
</script>
