export interface Pagination {
  limit?: number
  page?: number
  order?: 'ASC' | 'DESC'
  sort?: string
  search?: string
  [key: string]: string | number | undefined
}
