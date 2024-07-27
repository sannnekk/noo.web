<template>
  <entity-table
    :cols="(cols as any)"
    :data="(results as any)"
    :is-loading="isLoading"
  />
</template>

<script setup lang="ts">
import type { ColType } from '@/components/structures/entity-table/entity-table.vue'
import type { Poll } from '@/core/data/entities/Poll'
import type { User } from '@/core/data/entities/User'

interface Props {
  results: User[]
  isLoading?: boolean
  pollId: Poll['id']
}

const props = defineProps<Props>()

const cols: ColType[] = [
  {
    title: '',
    type: 'avatar',
    value: (user: User) => user
  },
  {
    title: 'Имя',
    type: 'text',
    value: (user: User) => user.name
  },
  {
    title: 'Никнейм',
    type: 'text',
    value: (user: User) => user.username
  },
  {
    title: 'E-mail',
    type: 'text',
    value: (user: User) => user.email
  },
  {
    title: 'Telegram',
    type: 'button',
    design: 'telegram',
    value: (user: User) => user.telegramUsername,
    linkTo: (user: User) => `https://t.me/${user.telegramUsername}`
  },
  {
    title: '',
    value: () => 'Посмотреть',
    type: 'button',
    design: 'secondary',
    linkTo: (user: User) => `/poll/${props.pollId}/results/${user.username}`
  }
]
</script>
