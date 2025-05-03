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
              @cancel-email-change="profileStore.cancelChangeEmail()"
              @change-avatar="profileStore.changeAvatar($event)"
            />
          </div>
        </div>
      </template>
      <template #content>
        <div
          class="index-profile-view__content"
          v-if="
            Core.Context.User &&
            Core.Context.roleIs(['teacher', 'mentor', 'student'])
          "
        >
          <tabs-view
            :titles="[
              'Моя статистика',
              Core.Context.roleIs(['student']) ? 'Мои кураторы' : '',
              Core.Context.roleIs(['mentor']) ? 'Мои ученики' : '',
              Core.Context.roleIs(['student', 'mentor']) ? 'Мои опросы' : ''
            ]"
            v-model:tab-index="profileStore.currentTab"
          >
            <template #tab-0>
              <div class="index-profile-view__charts">
                <statistics-view
                  v-once
                  :username="Core.Context.User?.username"
                />
              </div>
            </template>
            <template #tab-1>
              <div
                class="index-profile-view__mentor"
                v-if="Core.Context.roleIs(['student'])"
              >
                <student-mentors-view
                  :mentor-assignments="profileStore.user.mentorAssignmentsAsStudent!"
                  :student="Core.Context.User!"
                />
              </div>
            </template>
            <template #tab-2>
              <div
                class="index-profile-view__students"
                v-if="profileStore.currentTab === 2"
              >
                <my-students-view />
              </div>
            </template>
            <template #tab-3>
              <div class="index-profile-view__polls">
                <my-polls-view v-if="profileStore.currentTab === 3" />
              </div>
            </template>
          </tabs-view>
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
import myStudentsView from '../components/my-students-view.vue'
import MyPollsView from '../components/my-polls-view.vue'
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
    margin-top: 1em
    padding-top: 1em
    border-top: 1px solid var(--border-color)

  &__charts
    margin-top: 1em
    padding-top: 1em
    border-top: 1px solid var(--border-color)

  &__polls
    margin-top: 1em
    border-top: 1px solid var(--border-color)

  &__students
    margin-top: 1em
    border-top: 1px solid var(--border-color)

  &__statistics-table
    margin-top: 1em
    padding-top: 1em
    border-top: 1px solid var(--border-color)
</style>
