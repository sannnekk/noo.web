<template>
  <div class="edit-user-view">
    <the-sidebar-layout v-if="usersStore.user">
      <template #sidebar>
        <div class="edit-user-view__credentials">
          <div class="edit-user-view__credentials__avatar">
            <user-avatar
              :src="usersStore.user.avatar"
              :name="usersStore.user.name"
            />
          </div>
          <div class="edit-user-view__credentials__name">
            <h2>{{ usersStore.user.name }}</h2>
          </div>
          <div class="edit-user-view__credentials__username">
            <p>
              Никнейм: <b>{{ usersStore.user.username }}</b>
            </p>
          </div>
          <div class="edit-user-view__credentials__email">
            <p>
              Email: <b>{{ usersStore.user.email }}</b>
            </p>
          </div>
          <div class="edit-user-view__credentials__role">
            <role-tag :role="usersStore.user.role" />
          </div>
          <div
            class="edit-user-view__credentials__telegram"
            v-if="usersStore.user.telegramUsername"
          >
            <common-button
              :to="`https://t.me/${usersStore.user.telegramUsername}`"
              design="primary"
              alignment="stretch"
            >
              Telegram: {{ usersStore.user.telegramUsername }}
            </common-button>
          </div>
        </div>
      </template>
      <template #content>
        <div class="edit-user-view__content">
          <div class="edit-user-view__content__form">
            <user-form v-model="usersStore.user" />
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
                @click="usersStore.saveUser()"
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

<script setup lang="ts">
import CommonButton from '@/components/form/common-button.vue'
import userForm from '../components/user-form.vue'
import { useUsersStore } from '../stores/user'

const usersStore = useUsersStore()
</script>

<style scoped lang="sass">
.edit-user-view
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
    &__form
      padding: 1em

    &__actions
      padding: 1em
      display: flex
      justify-content: flex-end
      gap: 1em
</style>
