import { useDate } from '@/composables/useDate'
import { Core } from '@/core/Core'
import type { CalenderEvent } from '@/core/data/entities/CalenderEvent'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { v4 as uuid } from 'uuid'

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
      isPrivate: false
    }
  }

  /**
   * New event object
   */
  const newEvent = ref<Omit<CalenderEvent, 'id'>>(emptyEvent())

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
    uiService.setLoading(true)

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
      uiService.setLoading(false)
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

  return {
    currentDate,
    events,
    newEvent,
    dayFunction,
    onEventSubmit,
    onEventRemove
  }
})
