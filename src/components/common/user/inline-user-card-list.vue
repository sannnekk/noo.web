<template>
  <div
    class="inline-user-card-list"
    v-auto-animate
  >
    <div
      class="inline-user-card-list__item"
      v-for="user in usersModel"
      :key="user.id"
    >
      <inline-user-card
        class="inline-user-card-list__item__card"
        :user="user"
      />
    </div>
    <div
      class="inline-user-card-list__more-button"
      v-if="users.length > 1"
      @click="isOpened = !isOpened"
    >
      <slot
        name="more-button"
        :isOpened="isOpened"
      >
        {{ isOpened ? 'Скрыть' : 'Показать еще' }}
      </slot>
    </div>
    <div
      class="inline-user-card-list__empty"
      v-if="users.length === 0"
    >
      <slot name="empty"> Пользователи не найдены </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/core/data/entities/User'
import { computed, ref } from 'vue'

interface Props {
  users: User[]
}

const props = defineProps<Props>()

const isOpened = ref(false)
const usersModel = computed(() =>
  isOpened.value ? props.users : props.users.slice(0, 1)
)
</script>

<style lang="sass" scoped>
.inline-user-card-list
	&__item
		&__card
			margin-top: 0.3em
			margin-bottom: 0.3em

	&__more-button
		color: var(--text-light)
		font-size: 0.8em
		cursor: pointer

		&:hover
			color: var(--secondary)

	&__empty
		color: var(--text-light)
		font-size: 0.8em
</style>
