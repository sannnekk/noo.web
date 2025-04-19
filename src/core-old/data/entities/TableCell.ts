import type { Entity } from '../Entity'

export type TableCellType =
  | 'user'
  | 'work'
  | 'text'
  | 'number'
  | 'date'
  | 'percentage'
  | 'formula'

export interface TableCell extends Entity {
  type: TableCellType
  value: string
  col: number
  row: number
  background: string | null
  metadata?: any
}
