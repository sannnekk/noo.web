<template>
  <div
    class="calender-event-item"
    :class="type"
  >
    <div class="calender-event-item__header">
      <h3 class="calender-event-item__header__title">
        {{ title }}
      </h3>
    </div>
    <div class="calender-event-item__body">
      <p class="calender-event-item__body__description">
        {{ description }}
      </p>
      <div class="calender-event-item__body__button">
        <common-button
          v-if="type !== 'event'"
          :to="to"
        >
          Перейти
        </common-button>
        <common-button
          @click="$emit('remove')"
          design="secondary"
          v-else
        >
          Удалить
        </common-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type CalenderEvent } from '@/types/composed/CalenderEvent'

interface Emits {
  (e: 'remove'): void
}

defineProps<CalenderEvent>()
defineEmits<Emits>()
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

  &.teacher-deadline
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
</style>
