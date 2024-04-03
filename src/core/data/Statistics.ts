export interface Statistics {
  entries: {
    name: string
    value: number
  }[]
  plots: Plot[]
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
