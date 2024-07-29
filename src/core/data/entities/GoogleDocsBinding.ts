import type { GoogleAuthCredential } from '@/core/utils/google-auth'
import type { Entity } from '../Entity'

export interface GoogleDocsBinding extends Entity {
  name: string
  entityName: string
  entitySelector: {
    prop: string
    value: string
  }
  filePath: string
  googleOAuthToken: string
  googleCredentials: GoogleAuthCredential
  status: 'active' | 'inactive' | 'error'
  format: 'csv'
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly'
  createdAt: Date
  updatedAt: Date
}
