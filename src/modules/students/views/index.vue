<template>
  <div class="index-students-view">
    <entity-table
      :cols="cols"
      :data="data"
    />
  </div>
</template>

<script lang="ts" setup>
import type { User } from '@/types/entities/User'
import { reactive } from 'vue'

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
    role: 'student',
    email: 'maria@gmail.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
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
    role: 'student',
    email: 'sidorov@s.ru',
    avatar: 'https://i.pravatar.cc/150?img=3',
    isBlocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    telegramId: '1234567890'
  }
])
</script>

<style lang="sass" scoped></style>
