<template>
  <div class="index-students-view">
    <div class="index-students-view__search">
      <search-field v-model="usersStore.search" />
    </div>
    <div class="index-students-view__table">
      <entity-table
        :cols="cols"
        :data="usersStore.users"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { User } from '@/types/entities/User'
import { useUsersStore } from '../stores/user'

const cols = [
  {
    title: '',
    keys: ['avatar.url', 'name'],
    type: 'avatar'
  },
  {
    title: 'Имя',
    keys: ['name'],
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
          return { text: 'Студент', type: 'info' }
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
    deisng: 'secondary',
    linkTo: (user: User) => `https://t.me/${user.telegramUsername}`
  },
  {
    title: '',
    value: () => 'Редактировать',
    type: 'link',
    design: 'secondary',
    linkTo: (user: User) => `/users/edit/${user.username}`
  }
]

const usersStore = useUsersStore()
</script>

<style lang="sass" scoped>
.index-students-view
  &__search
    padding: 1rem
</style>
