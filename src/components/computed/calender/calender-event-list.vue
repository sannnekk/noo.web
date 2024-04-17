<template>
  <div class="calender-event-list">
    <div class="calender-event-list__header">
      <h2 class="calender-event-list__header__title">
        События {{ dateFormatter.toBeautiful() }}
      </h2>
      <ul class="calender-event-list__header__legend">
        <li>
          <span
            class="calender-event-list__header__legend__color"
            style="background: var(--danger)"
          ></span>
          дедлайн сдачи работы
        </li>
        <li>
          <span
            class="calender-event-list__header__legend__color"
            style="background: var(--lila)"
          ></span>
          дедлайн проверки работы
        </li>
        <li>
          <span
            class="calender-event-list__header__legend__color"
            style="background: var(--success)"
          ></span>
          работа проверена
        </li>
        <li>
          <span
            class="calender-event-list__header__legend__color"
            style="background: var(--warning)"
          ></span>
          работа сдана
        </li>
        <li>
          <span
            class="calender-event-list__header__legend__color"
            style="background: var(--text-light)"
          ></span>
          другое событие
        </li>
      </ul>
    </div>
    <div
      class="calender-event-list__events"
      v-auto-animate
    >
      <calender-event-item
        v-for="event in eventsOnDate"
        :key="event.id"
        v-bind="event"
        @remove="$emit('remove', event.id)"
      />
      <div
        v-if="!eventsOnDate.length"
        class="calender-event-list__events__empty"
      >
        <p>Нет событий в этот день</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDate } from '@/composables/useDate'
import { computed } from 'vue'
import { type CalenderEvent } from '@/core/data/entities/CalenderEvent'
import calenderEventItem from './calender-event-item.vue'

interface Props {
  date: Date
  events: (CalenderEvent & { to?: string })[]
}

interface Emits {
  (e: 'remove', id: string): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const dateFormatter = computed(() => useDate(props.date, { precision: 'day' }))

const eventsOnDate = computed(() => {
  return props.events.filter((event) => {
    return dateFormatter.value.isOnSameDay(event.date)
  })
})
</script>

<style scoped lang="sass">
.calender-event-list
  &__header
    &__title
      font-weight: 500

    &__legend
      list-style: none
      padding: 0
      margin: 0
      display: flex
      flex-direction: row
      flex-wrap: wrap
      gap: 0.5em 1em
      margin-bottom: 1rem
      font-size: 0.7em

      &__color
        display: inline-block
        width: 1em
        height: 1em
        border-radius: 50%
        margin-right: 0.2em
        transform: translateY(0.2em)

  &__events
    &__empty
      color: var(--text-light)
</style>
@/core/data/entities/CalenderEvent
