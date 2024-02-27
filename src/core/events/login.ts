import type { Context } from '../context/Context'
import type { EventFunc } from '../context/EventEmitter'

export const loginTrigger: EventFunc = (context: Context) => {
  console.log('Event triggered: global:login')

  if (context.Route.path === '/auth') {
    window.location.replace('/courses')
  }
}
