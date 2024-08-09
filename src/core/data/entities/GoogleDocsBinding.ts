import type { GoogleAuthCredential } from '@/core/utils/google-auth'
import type { Entity } from '../Entity'

export interface GoogleDocsBinding extends Entity {
  name: string
  entityName: string
  entitySelector: {
    prop: string
    value: string
  }
  filePath: string[]
  googleOAuthToken: string
  googleCredentials: GoogleAuthCredential
  status: 'active' | 'inactive' | 'error'
  lastErrorText: string | null
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly'
  lastRunAt: Date | null
  createdAt: Date
  updatedAt: Date
}
