<template>
  <div class="user-mentor">
    <h3>Мой куратор</h3>
    <user-card
      v-if="mentor"
      :user="mentor"
    />
    <p
      v-else
      class="index-profile-view__mentor__no-mentor"
    >
      У вас пока нет куратора
    </p>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/core/data/entities/User'

interface Props {
  mentor: User
}

defineProps<Props>()
</script>

<style scoped lang="sass"></style>
