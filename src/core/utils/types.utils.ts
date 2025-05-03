import type { ApiEntity } from '../api/api.types'

export type PossiblyUnsavedEntity<T extends ApiEntity> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt'
> & {
  id?: string
  createdAt?: Date
  updatedAt?: Date
}
