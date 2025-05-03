import type { RouteRecordRaw } from 'vue-router'

export interface ApplicationModule {
  name: string
  diDefinitions: Record<string, any>
  routes?: RouteRecordRaw[]
}
