import type { TableCell, TableCellType } from '@/core/data/entities/TableCell'
import { v4 as uuid } from 'uuid'

export function emptyCell(
  type: TableCellType,
  y: number,
  x: number
): TableCell {
  return {
    type,
    row: y,
    col: x,
    value: getDefaultValue(type),
    id: uuid(),
    background: null
  }
}

function getDefaultValue(type: TableCellType): string {
  switch (type) {
    case 'text':
      return ''
    case 'number':
    case 'percentage':
      return '0'
    case 'formula':
      return ''
    case 'date':
      return new Date().toISOString()
    case 'user':
    case 'work':
    default:
      return ''
  }
}
