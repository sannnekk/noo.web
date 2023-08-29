export interface Criteria<T> {
  predicate?: (value: T) => boolean
  pagination?: number
  offset?: number
  limit?: number
  sort?: string
  order?: string
}
