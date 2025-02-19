import type { Entity } from '../Entity'
import type { TableCell } from './TableCell'
import type { User } from './User'

export interface Table extends Entity {
  title: string
  user?: User
  cells: TableCell[]
}
