export interface IPagination {
  page?: number
  pageSize?: number
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  filters?: IFilter[]
  toQuery: () => Record<string, string>
}

export interface IFilter {
  getQueryKey: () => string
  getQueryValue: () => string
}

class Pagination implements IPagination {
  public page: number
  public pageSize: number
  public sortBy?: string
  public sortDirection?: 'asc' | 'desc'
  public filters: IFilter[]
  public search?: string

  public constructor(
    page = 1,
    pageSize = 10,
    sortBy: string | undefined = undefined,
    sortDirection: 'asc' | 'desc' | undefined = 'desc',
    filters: IFilter[] = [],
    search: string | undefined = undefined
  ) {
    this.page = page
    this.pageSize = pageSize
    this.sortBy = sortBy
    this.sortDirection = sortDirection
    this.filters = filters
    this.search = search
  }

  public toQuery(): Record<string, string> {
    const params: URLSearchParams = new URLSearchParams()

    if (this.page) params.append('page', this.page.toString())
    if (this.pageSize) params.append('pageSize', this.pageSize.toString())
    if (this.sortBy) {
      params.append('sortBy', this.sortBy)
      params.append('sortDirection', this.sortDirection || 'desc')
    }
    if (this.search) params.append('search', this.safeQueryString(this.search))

    if (this.filters.length) {
      this.filters.forEach((filter) => {
        const key = filter.getQueryKey()
        const value = filter.getQueryValue()

        params.append(`filter.${key}`, value)
      })
    }

    return Object.fromEntries(params.entries())
  }

  private safeQueryString(query: string): string {
    return query.replace(/[^a-zA-Z0-9а-яА-ЯёЁ0-9\s]/g, '')
  }
}

class DateRangeFilter implements IFilter {
  private startDate: Date | null
  private endDate: Date | null
  private key: string

  constructor(key: string, startDate: Date | null, endDate: Date | null) {
    this.key = key
    this.startDate = startDate
    this.endDate = endDate
  }

  getQueryKey(): string {
    return this.key
  }

  getQueryValue(): string {
    const start = this.startDate ? this.startDate.toISOString() : 'null'
    const end = this.endDate ? this.endDate.toISOString() : 'null'

    return `date-range(${start},${end})`
  }
}

class BooleanFilter implements IFilter {
  private key: string
  private value: boolean

  constructor(key: string, value: boolean) {
    this.key = key
    this.value = value
  }

  getQueryKey(): string {
    return this.key
  }

  getQueryValue(): string {
    return this.value ? '1' : '0'
  }
}

class EnumFilter<Type extends string> implements IFilter {
  private key: string
  private value: Type

  constructor(key: string, value: Type) {
    this.key = key
    this.value = value
  }

  getQueryKey(): string {
    return this.key
  }

  getQueryValue(): string {
    return this.value.toString()
  }
}

export { Pagination, DateRangeFilter, BooleanFilter, EnumFilter }
