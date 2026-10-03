<template>
  <div
    class="telegram-view"
    v-if="!telegramStore.moduleLoading"
  >
    <settings-section>
      <template #title> Привязка Telegram </template>
      <template #content>
        <bind-telegram-form
          :telegram-username="telegramStore.user?.telegramUsername"
          :telegram-id="telegramStore.user?.telegramId"
          @bind="telegramStore.bindTelegram($event)"
          @unbind="telegramStore.unbindTelegram()"
        />
      </template>
    </settings-section>
    <settings-section>
      <template #title> Уведомления в Telegram </template>
      <template #content>
        <telegram-notifications-form
          :telegram-id="telegramStore.user?.telegramId"
          :notifications-enabled="
            telegramStore.user?.telegramNotificationsEnabled
          "
          @notifications-enabled-toggled="
            telegramStore.toggleNotificationsEnabled()
          "
        />
      </template>
    </settings-section>
    <settings-section>
      <template #title> Push-уведомления в браузере </template>
      <template #content>
        <push-notifications-form
          :supported="pushStore.isSupported"
          :needs-install="pushStore.needsInstall"
          :permission="pushStore.permission"
          :enabled="pushStore.isEnabled"
          :loading="pushStore.isLoading"
          @toggled="pushStore.toggle()"
        />
      </template>
    </settings-section>
  </div>
  <div
    class="telegram-view__loading"
    v-else
  >
    <loader-icon contrast />
  </div>
</template>

<script lang="ts" setup>
import BindTelegramForm from '../components/telegram/bind-telegram-form.vue'
import TelegramNotificationsForm from '../components/telegram/telegram-notifications-form.vue'
import PushNotificationsForm from '../components/push/push-notifications-form.vue'
import SettingsSection from '../components/settings-section.vue'
import { useTelegramStore } from '../stores/telegram'
import { usePushStore } from '../stores/push'

const telegramStore = useTelegramStore()
const pushStore = usePushStore()

telegramStore.fetchUser()
pushStore.fetchState()
</script>

<style lang="sass" scoped>
.telegram-view
  &__loading
    display: flex
    justify-content: center
    align-items: center
    height: 500px
    font-size: 3em
</style>
