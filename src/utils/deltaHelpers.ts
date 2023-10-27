import type { DeltaContentType } from '@/types/composed/DeltaContentType'

export function isDeltaEmptyOrWhitespace(delta: DeltaContentType | undefined) {
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
