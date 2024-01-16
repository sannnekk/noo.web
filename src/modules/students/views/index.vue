<template>
  <div class="index-students-view">
    <entity-table
      :cols="cols"
      :data="srudentsStore.students"
    />
  </div>
</template>

<script lang="ts" setup>
import type { User } from '@/types/entities/User'
import { useStudentsStore } from '../stores/students'

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
    linkTo: (user: User) => `https://t.me/${user.telegramUsername}`
  }
]

const srudentsStore = useStudentsStore()
</script>

<style lang="sass" scoped></style>
