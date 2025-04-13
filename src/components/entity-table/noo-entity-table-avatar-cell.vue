<template>
  <user-avatar
    v-if="value"
    :name="value.name"
    :avatar="value.avatar"
    :is-online="(value as UserWithOnlineStatus).isOnline"
  />
</template>

<script setup lang="ts">
import type { User, UserWithOnlineStatus } from '@/core/data/entities/User'

interface Props {
  value?: User | UserWithOnlineStatus
}

defineProps<Props>()
</script>

<style lang="sass" scoped>
div
  font-size: 3em
  padding: 0
  margin: 0
</style>
