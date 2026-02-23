export interface Statistics {
  sections: {
    name: string
    description: string
    entries: {
      name: string
      description?: string
      value: number
      percentage?: number
      subEntries?: {
        name: string
        description?: string
        value: number
        percentage?: number
      }[]
    }[]
    plots: Plot[]
  }[]
}

export interface Plot {
  name: string
  color:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
  data: {
    key: string
    value: number
    annotation?: string
  }[]
}
