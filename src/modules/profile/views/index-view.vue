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
              @change-email="changeEmailModalVisible = true"
              @change-avatar="profileStore.changeAvatar($event)"
            />
          </div>
        </div>
      </template>
      <template #content>
        <div
          class="index-profile-view__mentor"
          v-if="Core.Context.roleIs(['student'])"
        >
          <h2 class="index-profile-view__mentor__header">Мои кураторы</h2>
          <student-mentors-view
            :mentor-assignments="profileStore.user.mentorAssignmentsAsStudent!"
            :student="Core.Context.User!"
          />
        </div>
        <div
          class="index-profile-view__charts"
          v-if="
            Core.Context.User &&
            Core.Context.roleIs(['teacher', 'mentor', 'student'])
          "
        >
          <h2 class="index-profile-view__charts__header">Моя статистика</h2>
          <statistics-view
            v-once
            :username="Core.Context.User?.username"
          />
        </div>
      </template>
    </the-sidebar-layout>
  </div>
  <change-email-modal
    v-model:visible="changeEmailModalVisible"
    @confirm="profileStore.requestChangeEmail($event)"
  />
</template>

<script lang="ts" setup>
import changeEmailModal from '../components/change-email-modal.vue'
import ProfileCredentials from '../components/profile-credentials.vue'
import { Core } from '@/core/Core'
import { setPageTitle } from '@/core/utils/setPageTitle'
import { useProfileStore } from '../stores/profile'
import { ref } from 'vue'

const profileStore = useProfileStore()

setPageTitle('Мой профиль')

profileStore.fetchUser()

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
</style>
