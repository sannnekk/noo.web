<template>
  <entity-table
    :cols="cols"
    :data="results"
    :is-loading="isLoading"
  />
</template>

<script setup lang="ts">
import type { Poll } from '@/core/data/entities/Poll'
import type { User } from '@/core/data/entities/User'

interface Props {
  results: User[]
  isLoading?: boolean
  pollId: Poll['id']
}

const props = defineProps<Props>()

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
    design: 'telegram',
    linkTo: (user: User) => `https://t.me/${user.telegramUsername}`
  },
  {
    title: '',
    value: 'Посмотреть',
    type: 'link',
    design: 'secondary',
    linkTo: (user: User) => `/poll/${props.pollId}/results/${user.username}`
  }
]
</script>
