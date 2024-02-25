import { useDate } from '@/composables/useDate'
import { Core } from '@/core/Core'
import type { CalenderEvent } from '@/core/data/entities/CalenderEvent'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useCalenderStore = defineStore('calender', () => {
  const uiService = Core.Services.UI

  const currentDate = ref(new Date())

  const events = ref<CalenderEvent[]>([
    {
      id: '1',
      title: 'Homework Assignment 1',
      description: 'Complete the first homework assignment',
      date: new Date('2023-10-15T23:59:59'),
      type: 'student-deadline',
      to: '/works/1'
    },
    {
      id: '2',
      title: 'Quiz 1',
      description: 'Take the first quiz',
      date: new Date('2023-10-15T09:00:00'),
      type: 'teacher-deadline',
      to: '/works/1'
    },
    {
      id: '3',
      title: 'Midterm Exam',
      description: 'Take the midterm exam',
      date: new Date('2023-10-16T13:00:00'),
      type: 'work-checked',
      to: '/works/1'
    },
    {
      id: '4',
      title: 'Final Project Proposal',
      description: 'Submit the final project proposal',
      date: new Date('2023-10-09T23:59:59'),
      type: 'work-made',
      to: '/works/1'
    },
    {
      id: '5',
      title: 'Final Project Presentation',
      description: 'Present the final project',
      date: new Date('2023-10-11T10:00:00'),
      type: 'event',
      to: '/works/1'
    },
    {
      id: '6',
      title: 'Grading Deadline',
      description: 'Submit grades for the semester',
      date: new Date('2023-10-15T23:59:59'),
      type: 'teacher-deadline',
      to: '/works/1'
    },
    {
      id: '65',
      title: 'Grading Deadline',
      description: 'Submit grades for the semester',
      date: new Date('2023-10-15T23:59:59'),
      type: 'work-checked',
      to: '/works/1'
    },
    {
      id: '66',
      title: 'Grading Deadline',
      description: 'Submit grades for the semester',
      date: new Date('2023-10-15T23:59:59'),
      type: 'event',
      to: '/works/1'
    },
    {
      id: '67',
      title: 'Grading Deadline',
      description: 'Submit grades for the semester',
      date: new Date('2023-10-15T23:59:59'),
      type: 'work-made',
      to: '/works/1'
    },
    {
      id: '7',
      title: 'Code Review',
      description: 'Review code for the new feature',
      date: new Date('2022-01-25T15:00:00'),
      type: 'work-checked',
      to: '/works/1'
    },
    {
      id: '8',
      title: 'Bug Fixing',
      description: 'Fix bugs in the application',
      date: new Date('2022-02-10T23:59:59'),
      type: 'work-made',
      to: '/works/1'
    },
    {
      id: '9',
      title: 'Team Building Event',
      description: 'Attend the team building event',
      date: new Date('2022-03-05T14:00:00'),
      type: 'event',
      to: '/works/1'
    },
    {
      id: '10',
      title: 'Holiday',
      description: 'Enjoy the holiday',
      date: new Date('2022-05-30T00:00:00'),
      type: 'event',
      to: '/works/1'
    }
  ])

  const newEvent = ref<Omit<CalenderEvent, 'id'>>({
    date: currentDate.value,
    title: '',
    description: '',
    type: 'event',
    to: '/calender'
  })

  watch(currentDate, () => {
    newEvent.value.date = currentDate.value
    uiService.setLoading(true)

    setTimeout(() => {
      uiService.setLoading(false)
    }, 1000)
  })

  function dayFunction(date: Date): string[] {
    const dateFormatter = useDate(date, { precision: 'day' })
    const eventsOnThisDate = events.value.filter((event) => {
      return dateFormatter.isOnSameDay(event.date)
    })

    const marks = eventsOnThisDate.map((event) => {
      switch (event.type) {
        case 'student-deadline':
          return 'var(--danger)'
        case 'teacher-deadline':
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

  function onEventSubmit() {
    events.value.push({
      ...newEvent.value,
      id: String(events.value.length + 1)
    })
    newEvent.value = {
      date: currentDate.value,
      title: '',
      description: '',
      type: 'event',
      to: '/calender'
    }
  }

  function onEventRemove(id: string) {
    events.value = events.value.filter((event) => event.id !== id)
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
