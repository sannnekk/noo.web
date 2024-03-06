import { useDate } from '@/composables/useDate'
import { Core } from '@/core/Core'
import type { CalenderEvent } from '@/core/data/entities/CalenderEvent'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { v4 as uuid } from 'uuid'
import type { User } from '@/core/data/entities/User'

/**
 * Calender store
 */
export const useCalenderStore = defineStore('calender-module:calender', () => {
  const uiService = Core.Services.UI
  const calenderService = Core.Services.Calender

  /**
   * Current date
   */
  const currentDate = ref(new Date())

  /**
   * Events
   */
  const events = ref<(CalenderEvent & { to?: string })[]>([])

  /**
   * Empty event
   */
  function emptyEvent(): Omit<CalenderEvent, 'id'> {
    return {
      date: new Date(),
      title: '',
      description: '',
      type: 'event',
      visibility: 'private'
    }
  }

  /**
   * New event object
   */
  const newEvent = ref<Omit<CalenderEvent, 'id'>>(emptyEvent())

  /**
   * Loading
   */
  const isLoading = ref(false)

  /**
   * Watch for the current date change
   */
  watch(
    currentDate,
    async (oldDate, newDate) => {
      if (!newDate) {
        await fetchEvents(oldDate)
        return
      }

      newEvent.value.date = currentDate.value

      if (
        oldDate.getMonth() !== newDate.getMonth() ||
        oldDate.getFullYear() !== newDate?.getFullYear() ||
        events.value.length === 0
      ) {
        await fetchEvents(oldDate)
      }
    },
    { immediate: true }
  )

  /**
   * Fetch events
   */
  async function fetchEvents(date: Date) {
    isLoading.value = true

    try {
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1)
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const response = await calenderService.getEvents({
        'filter[date]': {
          type: 'range',
          value: [startDate, endDate]
        }
      })

      events.value = response.data
    } catch (error: any) {
      uiService.openErrorModal('Ошибка при получении событий', error.message)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get marks for the day
   */
  function dayFunction(date: Date): string[] {
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

  /**
   * Submit new event
   */
  async function onEventSubmit() {
    uiService.setLoading(true)

    try {
      await calenderService.createEvent({
        ...newEvent.value,
        id: undefined
      } as any)
      events.value.push({ ...newEvent.value, id: uuid() })
      newEvent.value = emptyEvent()
    } catch (error: any) {
      uiService.openErrorModal('Ошибка при создании события', error.message)
    } finally {
      uiService.setLoading(false)
    }
  }

  /**
   * Remove event
   */
  async function onEventRemove(id: string) {
    uiService.setLoading(true)

    try {
      await calenderService.deleteEvent(id)
      events.value = events.value.filter((event) => event.id !== id)
    } catch (error: any) {
      uiService.openErrorModal('Ошибка при удалении события', error.message)
    } finally {
      uiService.setLoading(false)
    }
  }

  /**
   * Event isibility options
   */
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
      for: ['admin', 'teacher', 'mentor', 'student'],
      value: 'private',
      label: 'Только я'
    }
  ]

  /**
   * Event visibility options available for current user
   */
  const visibilityOptions = allVisibilityOptions.filter((option) =>
    option.for.includes(Core.Context.User!.role)
  )

  return {
    currentDate,
    events,
    newEvent,
    dayFunction,
    onEventSubmit,
    onEventRemove,
    isLoading,
    visibilityOptions
  }
})
