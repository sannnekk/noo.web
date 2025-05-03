import { type Op } from 'quill/core'

export type RichTextType = 'delta'

type DeltaContentType = {
  ops: Op[]
}

export interface IRichText extends DeltaContentType {
  $type: RichTextType
}

export function richTextsAreEqual(
  richText1: IRichText | null | undefined,
  richText2: IRichText | null | undefined
): boolean {
  return JSON.stringify(richText1 ?? {}) === JSON.stringify(richText2 ?? {})
}
