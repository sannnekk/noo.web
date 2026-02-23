import type { User } from './User'

export interface Session {
  id: string
  userAgent: string
  isMobile: boolean
  userId: User['id']
  user?: User
  browser?: string | null
  os?: string | null
  device?: string | null
  ipAddress: string
  lastRequestAt: Date
  location?: string | null
  isCurrent?: boolean
  createdAt: Date
  updatedAt: Date
}
