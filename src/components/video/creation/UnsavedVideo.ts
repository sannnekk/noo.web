import type { Media } from '@/core/data/entities/Media'
import type { Video } from '@/core/data/entities/Video'

export type UnsavedVideo = Omit<
  Video,
  'id' | 'thumbnail' | 'uploadedBy' | 'comments'
> & {
  thumbnail: Media | null
  id: string | null
  uploadUrl: string | null
  url: string | null
}
