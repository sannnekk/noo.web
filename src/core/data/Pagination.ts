export interface Pagination {
  limit?: number
  page?: number
  order?: 'ASC' | 'DESC'
  sort?: string
  search?: string
}
