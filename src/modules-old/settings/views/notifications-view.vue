<template>
  <div class="notifications-view">
    <settings-section>
      <template #title>Отправить уведомление</template>
      <template #content>
        <create-notification-form @create="onNotificationCreate" />
      </template>
    </settings-section>
  </div>
</template>

<script lang="ts" setup>
import CreateNotificationForm from '../components/notifications/create-notification-form.vue'
import type { NotificationSendOptions } from '@/core/services/store/NotificationService'
import type { Notification } from '@/core/data/entities/Notification'
import SettingsSection from '../components/settings-section.vue'
import { useSettingsNotificationsStore } from '../stores/notifications'

const settingsNotificationsStore = useSettingsNotificationsStore()

function onNotificationCreate(
  notification: Notification,
  sendOptions: NotificationSendOptions
) {
  settingsNotificationsStore.createNotification(notification, sendOptions)
}
</script>
