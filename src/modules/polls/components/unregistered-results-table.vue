<template>
  <entity-table
    :cols="cols"
    :data="results"
    :is-loading="isLoading"
  />
</template>

<script setup lang="ts">
import type { ColType } from '@/components/structures/entity-table.vue'

interface Props {
  results: any[]
  isLoading: boolean
  pollId: string
}

const props = defineProps<Props>()

const cols: ColType[] = [
  {
    title: '',
    keys: ['avatarUrl', 'name'],
    type: 'avatar'
  },
  {
    title: 'Имя',
    keys: ['firstName', 'lastName'],
    type: 'text'
  },
  {
    title: 'Telegram',
    keys: ['username'],
    type: 'link',
    design: 'telegram',
    linkTo: ({ username }: { username: string }) => `https://t.me/${username}`
  },
  {
    title: '',
    value: 'Посмотреть',
    type: 'link',
    design: 'secondary',
    linkTo: ({ identifier }: { identifier: string }) =>
      `/poll/${props.pollId}/results/${identifier}?unregistered`
  }
]
</script>

<style scoped lang="sass"></style>
