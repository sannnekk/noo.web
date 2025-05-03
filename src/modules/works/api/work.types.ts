import type { ApiEntity } from '@/core/api/api.types'

export type WorkType =
  | 'mini-test'
  | 'test'
  | 'trial-work'
  | 'phrase'
  | 'second-part'

export interface WorkEntity extends ApiEntity {
  title: string
  type: WorkType
}
