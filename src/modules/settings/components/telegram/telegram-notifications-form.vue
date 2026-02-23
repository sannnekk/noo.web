<template>
  <div
    class="telegram-notifications-form"
    v-if="telegramId"
  >
    <form-toggle
      v-model="notificationsEnabledModel"
      :values="[
        { value: false, label: 'Уведомления выключены' },
        { value: true, label: 'Уведомления включены' }
      ]"
    />
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
import { computed } from 'vue'
interface Props {
  telegramId?: string
  notificationsEnabled?: boolean
}

interface Emits {
  (e: 'notifications-enabled-toggled', value: boolean): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const notificationsEnabledModel = computed({
  get: () => props.notificationsEnabled,
  set: (value) => emits('notifications-enabled-toggled', value)
})
</script>

<style lang="sass" scoped>
.telegram-notifications-form
	color: var(--text-light)
</style>
