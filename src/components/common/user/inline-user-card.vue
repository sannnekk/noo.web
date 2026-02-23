<template>
  <div class="inline-user-card">
    <div class="inline-user-card__avatar">
      <user-avatar
        :avatar="user.avatar"
        :name="user.name"
      />
    </div>
    <div class="inline-user-card__name">
      <user-link
        :username="user.username"
        :name="user.name"
      />
      <slot name="under-name" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/core/data/entities/User'

interface Props {
  user: User
}

defineProps<Props>()
</script>

<style lang="sass" scoped>
.inline-user-card
	display: flex
	align-items: center
	margin-bottom: 1em
	margin-top: 1em

	&__avatar
		margin-right: 0.5rem
		font-size: 2rem

	&__name
		font-size: 0.9em
</style>
