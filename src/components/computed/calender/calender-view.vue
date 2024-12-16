<template>
  <div class="index-calender-view">
    <div class="index-calender-view__calender">
      <calender-datepicker
        v-model="currentDate"
        :day-function="dayFunction"
      />
    </div>
    <div
      class="index-calender-view__events"
      v-auto-animate
    >
      <div
        class="index-calender-view__events__loading"
        v-if="isLoading"
      >
        <loader-icon contrast />
      </div>
      <div
        class="index-calender-view__events__inner"
        v-else
      >
        <calender-event-list
          :date="currentDate"
          :events="events"
          @remove="onEventRemove($event)"
        />
        <calender-event-form
          v-if="Core.Context.User?.username === username"
          v-model="newEvent"
          :visibility-options="visibilityOptions"
          @submit="onEventSubmit()"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import calenderEventList from './calender-event-list.vue'
import calenderEventForm from './calender-event-form.vue'
import type { CalenderEvent } from '@/core/data/entities/CalenderEvent'
import { Core } from '@/core/Core'
import { useDate } from '@/composables/useDate'
import { ref, watch } from 'vue'
import type { User } from '@/core/data/entities/User'

interface Props {
  username: string
}

const props = defineProps<Props>()

const uiService = Core.Services.UI
const calenderService = Core.Services.Calender

const currentDate = ref(new Date())
const isLoading = ref(false)

const events = ref<CalenderEvent[]>([])
const newEvent = ref<CalenderEvent>(emptyEvent())

watch(currentDate, () => (newEvent.value.date = currentDate.value))

watch(currentDate, (oldDate, newDate) => fetchEvents(oldDate, newDate), {
  immediate: true
})

async function fetchEvents(newDate: Date, oldDate?: Date) {
  if (!oldDate) {
    oldDate = newDate
  } else if (oldDate.getMonth() === newDate.getMonth()) {
    return
  }

  isLoading.value = true

  try {
    const startDate = new Date(newDate.getFullYear(), newDate.getMonth(), 0)
    const endDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 1)

    const response = await calenderService.getEvents({
      'filter[date]': {
        type: 'range',
        value: [startDate, endDate]
      },
      'filter[username]': {
        type: 'string',
        value: props.username
      }
    })

    events.value = response.data
  } catch (error: any) {
    uiService.openErrorModal('Ошибка при получении событий', error.message)
  } finally {
    isLoading.value = false
  }
}

async function onEventRemove(id: string) {
  try {
    await calenderService.deleteEvent(id, { showLoader: true })
    events.value = events.value.filter((event) => event.id !== id)
  } catch (error: any) {
    uiService.openErrorModal('Ошибка при удалении события', error.message)
  }
}

async function onEventSubmit() {
  try {
    const response = await calenderService.createEvent(
      {
        ...newEvent.value,
        id: undefined
      } as any,
      { showLoader: true }
    )

    if (!response.data) {
      throw new Error('Не удалось создать событие')
    }

    events.value.push(response.data)
    newEvent.value = emptyEvent()
  } catch (error: any) {
    uiService.openErrorModal('Ошибка при создании события', error.message)
  }
}

function emptyEvent() {
  return {
    title: '',
    description: '',
    date: currentDate.value,
    visibility: 'private',
    type: 'event',
    username: props.username
  } as CalenderEvent
}

function dayFunction(date: Date) {
  const dateFormatter = useDate(date, { precision: 'day' })
  const eventsOnThisDate = events.value.filter((event) => {
    return dateFormatter.isOnSameDay(event.date)
  })

  const marks = eventsOnThisDate.map((event) => {
    switch (event.type) {
      case 'student-deadline':
        return 'var(--danger)'
      case 'mentor-deadline':
        return 'var(--lila)'
      case 'work-checked':
        return 'var(--success)'
      case 'work-made':
        return 'var(--warning)'
      case 'event':
      default:
        return 'var(--text-light)'
    }
  })

  return [...new Set(marks)]
}

const allVisibilityOptions: {
  for: User['role'][]
  value: CalenderEvent['visibility']
  label: string
}[] = [
  { for: ['admin', 'teacher'], value: 'all', label: 'Все' },
  { for: ['mentor'], value: 'own-students', label: 'Мои ученики' },
  {
    for: ['admin', 'teacher', 'mentor'],
    value: 'all-mentors',
    label: 'Все кураторы'
  },
  {
    for: ['student'],
    value: 'own-mentor',
    label: 'Мой куратор'
  },
  {
    for: ['admin', 'teacher', 'mentor', 'student', 'assistant'],
    value: 'private',
    label: 'Только я'
  }
]

const visibilityOptions = allVisibilityOptions.filter((option) =>
  option.for.includes(Core.Context.User!.role)
)
</script>

<style lang="sass" scoped>
.index-calender-view
  display: flex
  flex-direction: row
  height: 100%

  @media screen and (max-width: 768px)
    flex-direction: column

  &__calender
    max-width: 330px
    width: 100%
    padding: 1em

    @media screen and (max-width: 768px)
      max-width: 100%
      width: 100%

  &__events
    flex: 1
    padding: 1em

    @media screen and (max-width: 768px)
      max-width: 100%
      width: 100%

    &__loading
      display: flex
      align-items: center
      justify-content: center
      height: 300px
      font-size: 5rem
</style>
