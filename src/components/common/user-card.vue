<template>
  <div class="user-card">
    <div class="user-card__avatar">
      <user-avatar
        :src="user.avatar"
        :name="user.name"
        @click="isModalOpen = true"
      />
    </div>
    <div
      class="user-card__credentials"
      @click="isModalOpen = true"
    >
      <h3 class="user-card__credentials__name">{{ user.name }}</h3>
      <p class="user-card__credentials__username">{{ user.username }}</p>
    </div>
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
  <user-info-modal
    v-model:visible="isModalOpen"
    :user="user"
  />
</template>

<script setup lang="ts">
import type { User } from '@/core/data/entities/User'
import { ref } from 'vue'

interface Props {
  user: User
}

const props = defineProps<Props>()

const isModalOpen = ref(false)
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
  cursor: pointer

  &:hover
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2)
    background-color: var(--border-color)

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
