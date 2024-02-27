import type { Context } from '../context/Context'
import type { EventFunc } from '../context/EventEmitter'

export const loginTrigger: EventFunc = (context: Context) => {
  console.log('Event triggered: global:login')

  if (context.Route.path === '/auth') {
    alert('You are logged in!')
    window.location.replace('/courses')
  }
}
