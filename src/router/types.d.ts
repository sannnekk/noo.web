import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    noAuth?: boolean
    pageTitle: string
    tabTitle: string
    warnOnLeave?: boolean
  }
}
