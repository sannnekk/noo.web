<template>
  <tabs-view
    :titles="['Данные', 'Календарь', 'Статистика', 'Работы']"
    v-model:tab-index="currentTab"
  >
    <template #tab-0>
      <div class="edit-user-view">
        <the-sidebar-layout v-if="userStore.user">
          <template #sidebar>
            <div class="edit-user-view__credentials">
              <div class="edit-user-view__credentials__avatar">
                <user-avatar
                  :avatar="userStore.user.avatar"
                  :name="userStore.user.name"
                />
              </div>
              <div class="edit-user-view__credentials__name">
                <h2>{{ userStore.user.name }}</h2>
              </div>
              <div class="edit-user-view__credentials__online-status">
                <online-status
                  :is-online="userStore.user.isOnline"
                  :last-seen="userStore.user.lastRequestAt"
                  :is-mobile="userStore.user.isLastRequestMobile"
                />
              </div>
              <div class="edit-user-view__credentials__username">
                <form-input
                  v-model="userStore.user.username"
                  type="text"
                  label="Никнейм"
                  readonly
                />
              </div>
              <div class="edit-user-view__credentials__email">
                <form-input
                  v-model="userStore.user.email"
                  type="email"
                  label="E-mail"
                  readonly
                />
              </div>
              <div class="edit-user-view__credentials__role">
                <role-tag :role="userStore.user.role" />
              </div>
              <div
                class="edit-user-view__credentials__telegram"
                v-if="userStore.user.telegramUsername"
              >
                <telegram-button :username="userStore.user.telegramUsername" />
              </div>
              <div
                class="edit-user-view__credentials__change-password"
                v-if="Core.Context.roleIs(['admin', 'teacher'])"
              >
                <common-button
                  design="danger"
                  alignment="center"
                  @click="showChangePasswordModal = true"
                >
                  Сменить пароль
                </common-button>
                <change-password-modal
                  v-model:visible="showChangePasswordModal"
                  :user="userStore.user"
                  @confirm="userStore.changePassword($event)"
                />
              </div>
            </div>
          </template>
          <template #content>
            <div class="edit-user-view__content">
              <warning-block v-if="userStore.user.verificationToken">
                <div class="edit-user-view__content__unverified-block">
                  <p>
                    <b>Пользователь не подтвержден</b>
                    <br />
                    Пользователь не сможет войти в систему, пока не подтвердит
                    свой аккаунт через имейл
                  </p>
                  <common-button
                    v-if="Core.Context.roleIs(['admin', 'teacher'])"
                    design="warning"
                    alignment="right"
                    @click="userStore.confirmUser()"
                  >
                    Подтвердить
                  </common-button>
                </div>
              </warning-block>
              <div class="edit-user-view__content__role">
                <change-role-form
                  :available="
                    Core.Context.roleIs(['admin', 'teacher']) &&
                    userStore.user.role === 'student'
                  "
                  @change-role="userStore.changeRole($event)"
                />
              </div>
              <div class="edit-user-view__content__form">
                <user-form
                  v-model="userStore.user"
                  :students-with-subjects="userStore.studentsWithSubjects"
                  @mentor-assigned="userStore.fetchUser()"
                />
              </div>
              <div class="edit-user-view__content__actions">
                <div class="edit-user-view__content__actions__return">
                  <common-button
                    to="/users"
                    alignment="right"
                    design="secondary"
                  >
                    Назад
                  </common-button>
                </div>
                <div class="edit-user-view__content__actions__save">
                  <common-button
                    v-if="Core.Context.roleIs(['admin', 'teacher'])"
                    @click="userStore.saveUser()"
                    alignment="right"
                    design="primary"
                  >
                    Сохранить
                  </common-button>
                </div>
              </div>
            </div>
          </template>
        </the-sidebar-layout>
      </div>
    </template>
    <template #tab-1>
      <div class="edit-user-view__calender">
        <calender-view
          v-if="userStore.user && currentTab === 1"
          :username="userStore.user.username"
        />
      </div>
    </template>
    <template #tab-2>
      <div class="edit-user-view__statistics">
        <statistics-view
          v-if="userStore.user && currentTab === 2"
          :username="userStore.user.username"
        />
      </div>
    </template>
    <template #tab-3>
      <div
        class="edit-user-view__assigned-works"
        v-if="['student', 'mentor'].includes(userStore.user?.role as any) && Core.Context.roleIs(['admin', 'teacher'])"
      >
        <assigned-works-view
          v-if="userStore.user && currentTab === 3"
          :user="userStore.user"
        />
      </div>
      <div
        class="edit-user-view__no-assigned-works"
        v-else
      >
        <p>
          Работы есть только у студентов и кураторов, просматривать их может
          только админ или преподаватель. Кураторы и ученики могут видеть только
          свои работы
        </p>
      </div>
    </template>
  </tabs-view>
</template>

<script setup lang="ts">
import ChangeRoleForm from '../components/change-role-form.vue'
import assignedWorksView from '../components/assigned-works-view.vue'
import changePasswordModal from '../components/change-password-modal.vue'
import userForm from '../components/user-form.vue'
import { useUserStore } from '../stores/user'
import { ref, watch } from 'vue'
import { setPageTitle } from '@/core/utils/setPageTitle'
import { Core } from '@/core/Core'

const userStore = useUserStore()

userStore.fetchUser()

const showChangePasswordModal = ref(false)

watch(
  () => userStore.user,
  () => {
    if (userStore.user) {
      setPageTitle(userStore.user.name)
      // TODO: удалить нахуй этот страшный костыль и реализовать нормально
      document.querySelector(
        '.pane-layout__header .header__page-title h1'
      )!.innerHTML = userStore.user.name
    }
  },
  { immediate: true, deep: true }
)

const currentTab = ref(0)
</script>

<style scoped lang="sass">
:deep() .tabs-view__titles
  margin-bottom: 1em
  padding-bottom: 1em
  border-bottom: 1px solid var(--border-color)

.edit-user-view
  &__statistics
    padding: 0.5em

  &__credentials
    text-align: center

    &__name
      h2
        margin: 0

    &__online-status
      margin-top: 0.6em
      margin-bottom: 1em

      > div
        justify-content: center

    &__avatar
      display: inline-block
      font-size: 180px

    &__username,
    &__email
      &:deep() input
        text-align: center

      p
        margin: 0
        color: var(--text-light)

        b
          font-weight: 600

    &__role
      margin-top: 1em
      margin-bottom: 1em

    &__change-password
      margin-top: 1em
      font-size: 0.8em

  &__content
    &__unverified-block
      display: flex

      p
        margin: 0
        font-size: 0.8em
        width: 100%

        b
          font-size: 1.3em

    &__form
      padding: 1em
      padding-top: 0

    &__actions
      padding: 1em
      display: flex
      justify-content: flex-end
      gap: 1em

  &__no-assigned-works
    text-align: center
    padding: 1em
</style>
