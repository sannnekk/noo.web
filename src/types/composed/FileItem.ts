export interface FileItem {
  key: string
  id?: string
  fileName: string
  src: string
  extension: 'png' | 'jpeg' | 'pdf'
  progress: number
  isUploaded: boolean
  error: string
  file: File | null
}
