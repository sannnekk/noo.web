<template>
  <router-link
    :to="link || ''"
    class="user-card"
    :class="{ 'user-card--clickable': !!link }"
  >
    <div class="user-card__avatar">
      <user-avatar
        :src="user.avatar"
        :name="user.name"
      />
    </div>
    <div class="user-card__credentials">
      <h3 class="user-card__credentials__name">{{ user.name }}</h3>
      <p class="user-card__credentials__username">{{ user.username }}</p>
    </div>
    <div class="user-card__actions">
      <slot name="actions" />
    </div>
  </router-link>
</template>

<script setup lang="ts">
import type { User } from '@/types/entities/User'

interface Props {
  user: User
  link?: string
}

const props = defineProps<Props>()
</script>

<style scoped lang="sass">
.user-card
  display: flex
  align-items: center
  gap: 1em
  text-decoration: none
  color: inherit
  border: 1px solid var(--border-color)
  border-radius: var(--border-radius)
  padding: 1em
  transition: 0.2s ease all

  &--clickable
    &:hover
      background-color: var(--border-color)

  &__avatar
    font-size: 50px

  &__credentials
    flex: 1

    &__name
      margin: 0
      margin-bottom: -0.2em
      color: var(--dark)
      font-size: 1.2em

    &__username
      margin: 0
      color: var(--text-light)
      font-size: 0.8em
</style>
