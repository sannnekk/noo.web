import type { UserRole } from '@/core/api/endpoints/auth.types'
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    noAuth?: boolean
    roles?: UserRole[]
    pageTitle: string
    tabTitle: string
    warnOnLeave?: boolean
  }
}
