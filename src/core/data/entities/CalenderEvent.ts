import type { Entity } from '../Entity'

export interface CalenderEvent extends Entity {
  title: string
  description: string
  date: Date
  isPrivate: boolean
  url?: string
  type:
    | 'student-deadline' // red
    | 'mentor-deadline' // lila
    | 'work-checked' // green
    | 'work-made' // yellow
    | 'event' // grey
}
