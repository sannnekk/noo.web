import { useRouter } from 'vue-router'
import type { Context } from '../context/Context'
import type { EventFunc } from '../context/EventEmitter'

export const initTrigger: EventFunc = (context: Context) => {
  console.log('Event triggered: global:init')

  if (
    context.Route.path !== '/auth' &&
    context.Route.path !== '/' &&
    context.User === null
  ) {
    context.clear()
    useRouter().push('/auth')
  }
}
