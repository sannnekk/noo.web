<template>
  <div
    class="calender-event-item"
    :class="type"
  >
    <div class="calender-event-item__header">
      <h3 class="calender-event-item__header__title">
        {{ title }}
      </h3>
      <p class="calender-event-item__header__visibility">
        <user-link :username="username">
          {{ username }}
        </user-link>
        - {{ visibilityText }}
      </p>
    </div>
    <div class="calender-event-item__body">
      <p class="calender-event-item__body__description">
        {{ description }}
      </p>
      <div class="calender-event-item__body__button">
        <common-button
          v-if="url"
          :to="url"
        >
          Перейти
        </common-button>
        <common-button
          @click="$emit('remove')"
          design="secondary"
          v-else-if="
            type === 'event' && Core.Context.User?.username === username
          "
        >
          Удалить
        </common-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import { type CalenderEvent } from '@/core/data/entities/CalenderEvent'
import { computed } from 'vue'

interface Emits {
  (e: 'remove'): void
}

const props = defineProps<CalenderEvent>()
defineEmits<Emits>()

const visibilityText = computed(() => {
  switch (props.visibility) {
    case 'all':
      return 'Видно всем'
    case 'private':
      return 'Приватное событие'
    case 'own-mentor':
      return 'Видно только ученику и его куратору'
    case 'all-mentors':
      return 'Видно всем кураторам'
    case 'own-students':
      return 'Видно только куратору и его ученикам'
    default:
      return 'Неизвестно'
  }
})
</script>

<style scoped lang="sass">
.calender-event-item
  width: 100%
  margin-bottom: 1rem
  padding: 0.5rem 1rem
  border-radius: var(--border-radius)

  &:hover
    background-color: var(--light)

  &.student-deadline
    border-left: 0.5rem solid var(--danger)

  &.mentor-deadline
    border-left: 0.5rem solid var(--lila)

  &.work-checked
    border-left: 0.5rem solid var(--success)

  &.work-made
    border-left: 0.5rem solid var(--warning)

  &.event
    border-left: 0.5rem solid var(--text-light)

  &__header
    &__title
      margin: 0
      padding: 0
      font-weight: 500

    &__visibility
      margin: 0
      padding: 0
      color: var(--text-light)
      font-size: 0.7em

  &__body
    width: 100%
    display: flex
    flex-direction: row
    align-items: center

    &__description
      margin: 0
      padding: 0
      color: var(--text-light)
      flex: 1
      font-size: 0.9em

    &__button
      font-size: 0.8em
</style>
