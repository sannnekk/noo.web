type ButtonType = 'primary' | 'secondary' | 'warning' | 'danger' | 'telegram'

export interface ColType {
  title: string
  type:
    | 'icon'
    | 'date'
    | 'avatar'
    | 'text'
    | 'iterator'
    | 'button'
    | 'image'
    | 'subject'
    | 'user'
  value?: (row: any) => any | any[]
  linkTo?: string | ((row: any) => string)
  width?: string
  joinType?: 'br' | '/' | ','

  // for button type
  action?: (row: any) => void
  design?: ButtonType | ((row: any) => ButtonType)
  isLoading?: (row: any) => boolean
  alignment?: 'left' | 'center' | 'right' | 'stretch'
}

export interface TreeColType extends ColType {}

export type Collapsable = any & {
  children?: Collapsable[]
  collapsed?: boolean
}
