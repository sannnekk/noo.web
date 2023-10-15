<template>
  <div class="index-students-view">
    <entity-table
      :cols="cols"
      :data="srudentsStore.students"
    />
  </div>
</template>

<script lang="ts" setup>
import { useStudentsStore } from '../stores/students'

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
    title: 'E-mail',
    keys: ['email'],
    type: 'text'
  },
  {
    title: 'Telegram',
    keys: ['telegramId'],
    type: 'link'
  }
]

const srudentsStore = useStudentsStore()
</script>

<style lang="sass" scoped></style>
