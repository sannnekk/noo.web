import type { ApiEntity } from '../api.types'

export type MimeType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'image/webp'
  | 'application/pdf'

export interface MediaEntity extends ApiEntity {
  path: string
  mime: MimeType
  fileName: string
  name: string
}
