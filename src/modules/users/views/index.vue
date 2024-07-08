<template>
  <div class="index-students-view">
    <div class="index-students-view__search">
      <search-field
        v-model="usersStore.pagination.search"
        :is-loading="usersStore.isListLoading"
      />
    </div>
    <div class="index-students-view__table">
      <entity-table
        :cols="cols"
        :data="usersStore.results"
        :is-loading="usersStore.isListLoading"
      />
    </div>
    <div
      class="index-students-view__pagination"
      v-if="usersStore.resultsMeta.total"
    >
      <list-pagination
        v-model:page="usersStore.pagination.page"
        :total="usersStore.resultsMeta.total"
        :limit="usersStore.pagination.limit"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { User } from '@/core/data/entities/User'
import { useUsersStore } from '../stores/users'
import { setPageTitle } from '@/core/utils/setPageTitle'
import { Core } from '@/core/Core'

const cols = [
  {
    title: '',
    keys: ['telegramAvatarUrl', 'name'],
    type: 'avatar'
  },
  {
    title: 'Имя',
    value: (user: User) =>
      user.verificationToken ? `[не подтвержден] ${user.name}` : user.name,
    type: 'text'
  },
  {
    title: 'Роль',
    keys: ['role'],
    type: 'tag',
    tagFunction: (key: string, value: string) => {
      switch (value) {
        case 'admin':
          return { text: 'Администратор', type: 'danger' }
        case 'teacher':
          return { text: 'Преподаватель', type: 'success' }
        case 'mentor':
          return { text: 'Куратор', type: 'black' }
        case 'student':
        default:
          return { text: 'Ученик', type: 'info' }
      }
    }
  },
  {
    title: 'Никнейм',
    keys: ['username'],
    type: 'text'
  },
  {
    title: 'E-mail',
    keys: ['email'],
    type: 'text'
  },
  {
    title: 'Telegram',
    keys: ['telegramUsername'],
    type: 'link',
    design: 'telegram',
    linkTo: (user: User) => `https://t.me/${user.telegramUsername}`
  },
  {
    title: '',
    value: Core.Context.User?.role === 'mentor' ? 'Перейти' : 'Редактировать',
    type: 'link',
    design: 'secondary',
    linkTo: (user: User) => `/users/edit/${user.username}`
  }
]

const usersStore = useUsersStore()

setPageTitle('Пользователи')
</script>

<style lang="sass" scoped>
.index-students-view
  &__search
    padding: 1rem
</style>
