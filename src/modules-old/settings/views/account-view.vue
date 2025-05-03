<template>
  <div class="account-view">
    <settings-section>
      <template #title> Активные сессии </template>
      <template #content>
        <div class="account-view__sessions">
          <session-view />
        </div>
      </template>
    </settings-section>
    <settings-section>
      <template #title> Смена пароля </template>
      <template #content>
        <div class="account-view__password-change">
          <password-change-form
            @change-password="accountStore.changePassword($event)"
          />
        </div>
      </template>
    </settings-section>
    <settings-section>
      <template #title> Удаление аккаунта </template>
      <template #content>
        <div class="account-view__sessionsdelete-account">
          <delete-account
            @delete-account="accountStore.deleteAccount($event)"
          />
        </div>
      </template>
    </settings-section>
  </div>
</template>

<script lang="ts" setup>
import passwordChangeForm from '../components/account/password-change-form.vue'
import deleteAccount from '../components/account/delete-account.vue'
import SettingsSection from '../components/settings-section.vue'
import SessionView from '../components/account/session-view.vue'
import { useAccountStore } from '../stores/account'

const accountStore = useAccountStore()
</script>
