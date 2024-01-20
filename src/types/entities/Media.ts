export interface Media {
  id: string
  src: string
  mimeType: 'image/jpeg' | 'image/png' | 'application/pdf'
  createdAt: Date
}
