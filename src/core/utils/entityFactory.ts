import type { Answer } from '@/core/data/entities/Answer'
import type { Comment } from '@/core/data/entities/Comment'
import { v4 as uuid } from 'uuid'

type EntityName = 'answer' | 'comment'
type Entity = Answer | Comment

export function entityFactory<T extends Entity>(name: EntityName): T {
  switch (name) {
    case 'answer':
      return answerConstructor() as T
    case 'comment':
      return commentConstructor() as T
    default:
      return {} as T
  }
}

function answerConstructor(): Omit<Answer, 'id'> {
  return {
    slug: uuid(),
    content: {
      ops: [{ insert: '\n' }]
    },
    taskId: '',
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

function commentConstructor(): Omit<Comment, 'id'> {
  return {
    slug: uuid(),
    content: {
      ops: [{ insert: '\n' }]
    },
    score: 0,
    taskId: '',
    createdAt: new Date(),
    updatedAt: new Date()
  }
}
