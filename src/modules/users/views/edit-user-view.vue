<template>
  <tabs-view :titles="['Данные', 'Календарь', 'Статистика']">
    <template #tab-0>
      <div class="edit-user-view">
        <the-sidebar-layout v-if="userStore.user">
          <template #sidebar>
            <div class="edit-user-view__credentials">
              <div class="edit-user-view__credentials__avatar">
                <user-avatar
                  :src="userStore.user.avatar"
                  :name="userStore.user.name"
                />
              </div>
              <div class="edit-user-view__credentials__name">
                <h2>{{ userStore.user.name }}</h2>
              </div>
              <div class="edit-user-view__credentials__username">
                <p>
                  Никнейм: <b>{{ userStore.user.username }}</b>
                </p>
              </div>
              <div class="edit-user-view__credentials__email">
                <p>
                  Email: <b>{{ userStore.user.email }}</b>
                </p>
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
                    v-if="
                      ['admin', 'teacher'].includes(
                        Core.Context.User?.role || '$$anonymous$$'
                      )
                    "
                    design="warning"
                    alignment="right"
                    @click="userStore.confirmUser()"
                  >
                    Подтвердить
                  </common-button>
                </div>
              </warning-block>
              <div class="edit-user-view__content__form">
                <user-form v-model="userStore.user" />
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
      <calender-view
        v-if="userStore.user"
        :username="userStore.user.username"
      />
    </template>
    <template #tab-2>
      <p class="statistics">&nbsp;&nbsp;&nbsp;Пока нет статистики</p>
    </template>
  </tabs-view>
</template>

<script setup lang="ts">
import userForm from '../components/user-form.vue'
import { useUserStore } from '../stores/user'
import { watch } from 'vue'
import { setPageTitle } from '@/core/utils/setPageTitle'
import { Core } from '@/core/Core'

const userStore = useUserStore()

userStore.fetchUser()

watch(
  () => userStore.user,
  () => {
    if (userStore.user) {
      setPageTitle(userStore.user.name)
      // TODO: удалить нахуй этот страшный костыль и реализовать нормально
      document.querySelector(
        '.pane-layout__header .header__logo h1'
      )!.innerHTML = userStore.user.name
    }
  },
  { immediate: true, deep: true }
)
</script>

<style scoped lang="sass">
:deep() .tabs-view__titles
  margin-bottom: 1em
  padding-bottom: 1em
  border-bottom: 1px solid var(--border-color)

.edit-user-view
  &__statistics
    text-align: center
    color: var(--text-light)
    padding: 3em 0

  &__credentials
    text-align: center

    &__avatar
      display: inline-block
      font-size: 180px

    &__username,
    &__email
      p
        margin: 0
        color: var(--text-light)

        b
          font-weight: 600

    &__role
      margin-top: 1em
      margin-bottom: 1em

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

    &__actions
      padding: 1em
      display: flex
      justify-content: flex-end
      gap: 1em
</style>
