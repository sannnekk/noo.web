export interface Pagination {
  limit?: number
  page?: number
  order?: 'ASC' | 'DESC'
  sort?: string
  search?: string
  relations?: string[]
  [key: `filter[${string}]`]: FilterType
}

export type FilterType =
  | {
      type: 'range'
      value: [string, string] | [Date, Date] | [number, number]
    }
  | {
      type: 'arr'
      value: string[]
    }
  | {
      type: 'tags'
      value: string[]
    }
  | {
      type: 'string'
      value: string
    }
  | {
      type: 'number'
      value: number
    }
  | {
      type: 'boolean'
      value: boolean
    }
  | {
      type: 'null'
      value: null
    }
