import type { Answer } from '@/core/data/entities/Answer'
import type { Comment } from '@/core/data/entities/Comment'
import type { Chapter } from '@/core/data/entities/Chapter'
import { v4 as uuid } from 'uuid'
import type { Material } from '../data/entities/Material'
import { emptyDelta } from './deltaHelpers'

type EntityName = 'answer' | 'comment' | 'chapter' | 'material'
type Entity = Answer | Comment | Chapter | Material

export function entityFactory<T extends Entity>(name: EntityName): T {
  switch (name) {
    case 'answer':
      return answerConstructor() as T
    case 'comment':
      return commentConstructor() as T
    case 'chapter':
      return chapterConstructor() as T
    case 'material':
      return materialConstructor() as T
    default:
      return {} as T
  }
}

function answerConstructor(): Omit<Answer, 'id'> {
  return {
    slug: uuid(),
    content: emptyDelta(),
    taskId: '',
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

function commentConstructor(): Omit<Comment, 'id'> {
  return {
    slug: uuid(),
    content: emptyDelta(),
    score: 0,
    taskId: '',
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

function chapterConstructor(): Omit<Chapter, 'id'> {
  return {
    slug: uuid(),
    name: '',
    courseId: '',
    order: 0,
    materials: [],
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

function materialConstructor(): Omit<Material, 'id' | 'chapterId'> {
  return {
    slug: uuid(),
    name: '',
    description: '',
    content: emptyDelta(),
    order: 0,
    files: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
}
