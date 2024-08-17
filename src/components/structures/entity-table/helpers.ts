import type { ColType } from './entity-table.vue'

// cell components
import entityTableAvatarCell from './entity-table-avatar-cell.vue'
import entityTableButtonCell from './entity-table-button-cell.vue'
import entityTableDateCell from './entity-table-date-cell.vue'
import entityTableIconCell from './entity-table-icon-cell.vue'
import entityTableIteratorCell from './entity-table-iterator-cell.vue'
import entityTableTextCell from './entity-table-text-cell.vue'
import entityTableSubjectCell from './entity-table-subject-cell.vue'
import entityTableImageCell from './entity-table-image-cell.vue'
import entityTableUserCell from './entity-table-user-cell.vue'
import type { Collapsable } from './types'

export async function onAction(
  col: ColType,
  row: any,
  index: number,
  keysRef: string[]
) {
  if (col.action) {
    await col.action(row)
    keysRef[index] = Math.random().toString()
  }
}

export function getValue(col: ColType, row: any, index: number): any[] {
  let result = null

  switch (col.type) {
    case 'icon':
    case 'date':
    case 'avatar':
    case 'text':
    case 'subject':
    case 'image':
    case 'user':
    case 'button':
      result = col.value?.(row)
      break
    case 'iterator':
      result = index + 1
      break
    default:
      result = null
      break
  }

  if (Array.isArray(result)) {
    result = result.map((value, i) => {
      return {
        value,
        joinType: i === result.length - 1 ? undefined : col.joinType
      }
    })

    return result
  }

  return [{ value: result }]
}

export function getCellComponent(type: ColType['type']) {
  switch (type) {
    case 'text':
      return entityTableTextCell
    case 'icon':
      return entityTableIconCell
    case 'date':
      return entityTableDateCell
    case 'avatar':
      return entityTableAvatarCell
    case 'iterator':
      return entityTableIteratorCell
    case 'button':
      return entityTableButtonCell
    case 'subject':
      return entityTableSubjectCell
    case 'image':
      return entityTableImageCell
    case 'user':
      return entityTableUserCell
    default:
      return 'td'
  }
}

export function treeToCollapsable(
  data: any[],
  childrenFunc: (row: any) => any[],
  parentIdChain: string[] = [],
  nestingLevel = 0
): Collapsable[] {
  const collapsable: Collapsable[] = []

  for (const row of data) {
    const newParentIdChain = [...parentIdChain, row.id]

    const children = (childrenFunc(row) || []).map((child) => {
      return {
        ...child,
        parentId: row.id,
        parentIdChain: newParentIdChain,
        collapsed: true
      }
    })

    const collapsableRow: Collapsable = {
      ...row,
      nestingLevel,
      collapsed: nestingLevel > 0
    }

    const childRows: any[] = []

    if (children.length) {
      childRows.push(
        ...treeToCollapsable(
          children,
          childrenFunc,
          newParentIdChain,
          nestingLevel + 1
        )
      )
    }

    collapsable.push(collapsableRow, ...childRows)
  }

  return collapsable
}
