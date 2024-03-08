import type { Context } from '../context/Context'
import type { EventFunc } from '../context/EventEmitter'

export const logoutTrigger: EventFunc = (context: Context) => {
  console.log('Event triggered: global:logout')

  context.clear()

  if (window.location.pathname !== '/auth') {
    window.location.replace('/auth')
  }
}
