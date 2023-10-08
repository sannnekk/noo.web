export interface CalenderEvent {
  id: string
  title: string
  description: string
  date: Date
  to: string
  type:
    | 'student-deadline' // red
    | 'teacher-deadline' // lila
    | 'work-checked' // green
    | 'work-made' // yellow
    | 'event' // grey
}
