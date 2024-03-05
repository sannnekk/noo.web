interface Op {
  insert?: string | Record<string, unknown> | undefined
  delete?: number
  retain?: Record<string, unknown> | number
  attributes?: {
    [key: string]: any
  }
}

export interface DeltaContentType {
  ops: Op[]
}
