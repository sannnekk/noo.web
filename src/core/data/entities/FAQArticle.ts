import type { DeltaContentType } from '@/types/composed/DeltaContentType'
import type { Entity } from '../Entity'
import type { User } from './User'
import type { FAQCategory } from './FAQCategory'

export interface FAQArticle extends Entity {
  for: (User['role'] | 'all')[]
  order: number
  title: string
  content: DeltaContentType
  category: FAQCategory
  categoryId: FAQCategory['id']
}
