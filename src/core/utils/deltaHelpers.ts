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
