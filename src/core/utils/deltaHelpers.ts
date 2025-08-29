import type { DeltaContentType } from '@/types/composed/DeltaContentType'

export function isDeltaEmptyOrWhitespace(
  delta: DeltaContentType | undefined | null
) {
  if (!delta) {
    return true
  }
  if (delta.ops.length === 0) {
    return true
  }
  for (let i = 0; i < delta.ops.length; i++) {
    if (delta.ops[i].insert instanceof Object) {
      return false
    }
    if ((delta.ops[i].insert as string).trim() !== '') {
      return false
    }
  }
  return true
}

export function emptyDelta(): DeltaContentType {
  return { ops: [{ insert: '\n' }] }
}

export function sliceTop(content: DeltaContentType, length = 5) {
  if (content.ops.length <= length) {
    return content
  }

  const sliced = content.ops
    .slice(0, length)
    .filter((op) => (op.insert as any)?.image === undefined)

  return {
    ops: [...sliced, { insert: '\n...' }]
  }
}

export function deltasAreEqual(
  a: DeltaContentType | null,
  b: DeltaContentType | null
) {
  return JSON.stringify(a || {}) === JSON.stringify(b || {})
}

/**
 * Insert a QuillDelta into another at a given character position.
 *
 * @param delta - The base delta (document state).
 * @param toInsert - The delta to insert.
 * @param position - Character index where insertion should happen.
 * @returns A new delta with `toInsert` spliced into `delta`.
 */
export function insertInDelta(
  delta: DeltaContentType,
  toInsert: DeltaContentType,
  position: number
): DeltaContentType {
  let index = 0
  const before: any[] = []
  const after: any[] = []

  for (const op of delta.ops) {
    if (op.insert) {
      const length = typeof op.insert === 'string' ? op.insert.length : 1

      if (index + length <= position) {
        // Entire op is before insertion point
        before.push(op)
      } else if (index >= position) {
        // Entire op is after insertion point
        after.push(op)
      } else {
        // Split op at insertion point
        const splitAt = position - index
        if (typeof op.insert === 'string') {
          before.push({
            insert: op.insert.slice(0, splitAt),
            attributes: op.attributes
          })
          after.unshift({
            insert: op.insert.slice(splitAt),
            attributes: op.attributes
          })
        } else {
          // For embeds (images, videos, etc.), treat as length 1
          if (splitAt === 0) {
            after.unshift(op)
          } else {
            before.push(op)
          }
        }
      }

      index += length
    } else {
      // Retain/delete shouldn't normally appear in composed delta docs,
      // but just in case, keep them in "before"
      before.push(op)
    }
  }

  return {
    ops: [...before, ...toInsert.ops, ...after]
  }
}
