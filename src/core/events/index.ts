import type { Context } from '../context/Context'
import type { EventName } from '../context/EventEmitter'
import { logoutTrigger } from './logout'
import { initTrigger } from './init'
import { loginTrigger } from './login'
import { retryLoginTrigger } from './retry-login'

export const events: { [K in EventName]: [(context: Context) => void] | [] } = {
  'global:logout': [logoutTrigger],
  'global:login': [loginTrigger],
  'global:init': [initTrigger],
  'global:retry-login': [retryLoginTrigger]
}
