<template>
  <div
    class="index-profile-view"
    v-if="profileStore.user"
  >
    <the-sidebar-layout>
      <template #sidebar>
        <div class="index-profile-view__user-info">
          <div class="index-profile-view__credentials">
            <profile-credentials
              v-model="profileStore.user"
              @save="profileStore.updateCredentials()"
              @add-telegram="telegramModal.visible = true"
              @remove-telegram="profileStore.removeTelegram()"
              @change-email="changeEmailModalVisible = true"
            />
          </div>
          <div class="index-profile-view__password-change">
            <profile-password-form
              v-model="profileStore.passwords"
              @save="profileStore.changePassword()"
            />
          </div>
          <div class="index-profile-view__delete-account">
            <delete-account @delete-account="profileStore.deleteAccount()" />
          </div>
        </div>
      </template>
      <template #content>
        <div class="index-profile-view__mentor">
          <user-mentor
            v-if="profileStore.mentor"
            :mentor="profileStore.mentor"
          />
        </div>
        <div
          class="index-profile-view__charts"
          v-if="
            Core.Context.User &&
            Core.Context.roleIs(['teacher', 'mentor', 'student'])
          "
        >
          <h3 class="index-profile-view__charts__header">Моя статистика</h3>
          <statistics-view
            v-once
            :username="Core.Context.User?.username"
          />
        </div>
        <div
          class="index-profile-view__active-sessions"
          v-if="Core.Context.User"
        >
          <h3 class="index-profile-view__active-sessions__header">
            Активные сеансы
          </h3>
          <session-view />
        </div>
        <div
          class="index-profile-view__google-docs-integrations"
          v-if="Core.Context.User && Core.Context.roleIs(['teacher'])"
        >
          <h3 class="index-profile-view__charts__header">
            Итеграции Google Docs
          </h3>
          <router-link to="/google-docs-bindings">
            Перейти в раздел интеграций
          </router-link>
        </div>
      </template>
    </the-sidebar-layout>
  </div>
  <add-telegram-modal
    v-model:visible="telegramModal.visible"
    v-model:auth-data="telegramModal.authData"
    @confirm="profileStore.updateTelegram(telegramModal.authData)"
  />
  <change-email-modal
    v-model:visible="changeEmailModalVisible"
    @confirm="profileStore.requestChangeEmail($event)"
  />
</template>

<script lang="ts" setup>
import changeEmailModal from '../components/change-email-modal.vue'
import addTelegramModal from '../components/add-telegram-modal.vue'
import ProfileCredentials from '../components/profile-credentials.vue'
import ProfilePasswordForm from '../components/profile-password-form.vue'
import deleteAccount from '../components/delete-account.vue'
import userMentor from '../components/user-mentor.vue'
import { Core } from '@/core/Core'
import { setPageTitle } from '@/core/utils/setPageTitle'
import { useProfileStore } from '../stores/profile'
import { ref } from 'vue'
import SessionView from '../components/session-view.vue'

const profileStore = useProfileStore()

setPageTitle('Мой профиль')

profileStore.fetchUser()

const telegramModal = ref({
  visible: false,
  authData: null
})

const changeEmailModalVisible = ref(false)
</script>

<style lang="sass" scoped>
.index-profile-view
  &__credentials
    margin-bottom: 1em

  &__password-change
    margin-top: 3em
    padding-top: 1em
    border-top: 1px solid var(--border-color)

  &__delete-account
    margin-top: 3em
    padding-top: 1em
    border-top: 1px solid var(--border-color)

  &__mentor
    margin-bottom: 2em

  &__google-docs-integrations
    margin-top: 2em

    a
      color: var(--lila)
      text-decoration: none

      &:hover
        text-decoration: underline
</style>
