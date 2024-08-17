import type { Entity } from '../Entity'
import type { FAQArticle } from './FAQArticle'

export interface FAQCategory extends Entity {
  name: string
  order: number
  childCategories: FAQCategory[]
  parentCategory: FAQCategory | null
  parentCategoryId: FAQCategory['id'] | null
  articles: FAQArticle[]
  createdAt?: Date
  updatedAt?: Date
}
