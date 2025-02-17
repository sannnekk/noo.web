<template>
  <entity-table
    :cols="cols"
    :data="results"
    :is-loading="isLoading"
  />
</template>

<script setup lang="ts">
import type { ColType } from '@/components/structures/entity-table/entity-table.vue'

interface Props {
  results: any[]
  isLoading: boolean
  pollId: string
}

const props = defineProps<Props>()

const cols: ColType[] = [
  {
    title: '',
    type: 'avatar',
    value: (user: any) => ({
      avatar: {
        telegramAvatarUrl: user.avatarUrl,
        avatarType: 'telegram'
      },
      name: user.firstName + ' ' + user.lastName
    })
  },
  {
    title: 'Имя',
    type: 'text',
    joinType: ',',
    value: (user: any) => [user.firstName, user.lastName]
  },
  {
    title: 'Telegram',
    type: 'button',
    design: 'telegram',
    alignment: 'left',
    value: (user: any) => user.username,
    linkTo: ({ username }: { username: string }) => `https://t.me/${username}`
  },
  {
    title: '',
    value: () => 'Посмотреть',
    type: 'button',
    design: 'secondary',
    linkTo: ({ identifier }: { identifier: string }) =>
      `/poll/${props.pollId}/results/${identifier}?unregistered`
  }
]
</script>
