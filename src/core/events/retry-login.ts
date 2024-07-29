import { Core } from '../Core'
import type { Context } from '../context/Context'
import type { EventFunc } from '../context/EventEmitter'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const retryLoginTrigger: EventFunc = (context: Context) => {
  console.log('Event triggered: global:retry-login')

  Core.Services.UI.openRetryLoginModal()
}
