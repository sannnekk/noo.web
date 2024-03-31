import { Core } from '../Core'
import type { Context } from '../context/Context'
import type { EventFunc } from '../context/EventEmitter'

export const retryLoginTrigger: EventFunc = (context: Context) => {
  console.log('Event triggered: global:retry-login')

  Core.Services.UI.openRetryLoginModal()
}
