<template>
  <div
    class="user-card"
    :class="{ 'user-card--clickable': !!link }"
  >
    <div class="user-card__avatar">
      <user-avatar
        :src="user.avatar"
        :name="user.name"
      />
    </div>
    <component
      :is="link ? 'router-link' : 'div'"
      class="user-card__credentials"
      :to="link || ''"
    >
      <h3 class="user-card__credentials__name">{{ user.name }}</h3>
      <p class="user-card__credentials__username">{{ user.username }}</p>
    </component>
    <div
      class="user-card__telegram"
      v-if="user.telegramUsername"
    >
      <telegram-button
        v-if="user.telegramUsername"
        :username="user.telegramUsername"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/core/data/entities/User'

interface Props {
  user: User
  link?: string
}

defineProps<Props>()
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
    &__credentials
      cursor: pointer

      &:hover
        color: var(--secondary)

  &__avatar
    font-size: 50px

  &__credentials
    display: block
    text-decoration: none
    color: inherit
    flex: 1

    &__name
      margin: 0
      margin-bottom: -0.2em
      color: var(--dark)
      font-size: 1.2em
      cursor: pointer

    &__username
      margin: 0
      color: var(--text-light)
      font-size: 0.8em
      cursor: pointer
</style>
