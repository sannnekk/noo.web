export interface Media {
  id: string
  slug: string
  url: string
  type: 'image' | 'video' | 'audio' | 'pdf'
  createdAt: Date
}
