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
          v-if="Core.Context.User && Core.Context.User.role !== 'admin'"
        >
          <h3 class="index-profile-view__charts__header">Моя статистика</h3>
          <statistics-view
            v-once
            :username="Core.Context.User?.username"
          />
        </div>
      </template>
    </the-sidebar-layout>
  </div>
</template>

<script lang="ts" setup>
import ProfileCredentials from '../components/profile-credentials.vue'
import ProfilePasswordForm from '../components/profile-password-form.vue'
import deleteAccount from '../components/delete-account.vue'
import userMentor from '../components/user-mentor.vue'
import { Core } from '@/core/Core'
import { setPageTitle } from '@/core/utils/setPageTitle'
import { useProfileStore } from '../stores/profile'

const profileStore = useProfileStore()

setPageTitle('Мой профиль')

profileStore.fetchUser()
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
</style>
