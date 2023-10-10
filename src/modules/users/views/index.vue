<template>
  <div class="index-students-view">
    <div class="index-students-view__search">
      <search-field v-model="search" />
    </div>
    <div class="index-students-view__table">
      <entity-table
        :cols="cols"
        :data="data"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { User } from '@/types/entities/User'
import { reactive, ref } from 'vue'

const cols = [
  {
    title: '',
    keys: ['avatar', 'name'],
    type: 'avatar'
  },
  {
    title: 'Имя',
    keys: ['name'],
    type: 'text'
  },
  {
    title: '',
    keys: ['role'],
    type: 'tag',
    tagFunction: (key: string, value: string) => {
      switch (value) {
        case 'admin':
          return { text: 'Администратор', type: 'success' }
        case 'teacher':
          return { text: 'Преподаватель', type: 'warning' }
        case 'mentor':
          return { text: 'Куратор', type: 'danger' }
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
    title: 'Email',
    keys: ['email'],
    type: 'text'
  },
  {
    title: 'Telegram',
    keys: ['telegramId'],
    type: 'link'
  }
]

const data = reactive<User[]>([
  {
    id: '1',
    slug: '1',
    name: 'Иванов Иван Иванович',
    username: 'nukleoid',
    role: 'student',
    email: 'nukleoid@outlook.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    isBlocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    telegramId: '1234567890'
  },
  {
    id: '2',
    slug: '2',
    name: 'Петров Петр Петрович',
    username: 'petrov',
    role: 'admin',
    email: 'maria@gmail.com',
    isBlocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    telegramId: '1234567890'
  },
  {
    id: '3',
    slug: '3',
    name: 'Сидоров Сидор Сидорович',
    username: 'sidorov',
    role: 'mentor',
    email: 'sidorov@s.ru',
    avatar: 'https://i.pravatar.cc/150?img=3',
    isBlocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    telegramId: '1234567890'
  },
  {
    id: '4',
    slug: '4',
    name: 'Мария Иванова',
    username: 'maria',
    role: 'teacher',
    email: 'teacher@noo.ru',
    avatar: 'https://i.pravatar.cc/150?img=4',
    isBlocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    telegramId: '1234567890'
  }
])

const search = ref('')
</script>

<style lang="sass" scoped>
.index-students-view
  &__search
    padding: 1rem
</style>
