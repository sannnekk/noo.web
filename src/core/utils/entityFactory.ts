import { emptyDelta } from './deltaHelpers'
import { v4 as uuid } from 'uuid'
import type { Answer } from '@/core/data/entities/Answer'
import type { Comment } from '@/core/data/entities/Comment'
import type { Chapter } from '@/core/data/entities/Chapter'
import type { Material } from '../data/entities/Material'
import type { Course } from '../data/entities/Course'
import type { Subject } from '../data/entities/Subject'
import type { Poll } from '../data/entities/Poll'
import type { Task } from '../data/entities/Task'
import type { CourseAssignment } from '../data/entities/CourseAssignment'

type EntityName =
  | 'answer'
  | 'comment'
  | 'chapter'
  | 'material'
  | 'course'
  | 'subject'
  | 'poll'
  | 'task'
  | 'course-assignment'

type Entity =
  | Answer
  | Comment
  | Chapter
  | Material
  | Course
  | Subject
  | Poll
  | Task
  | CourseAssignment

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
    case 'course':
      return courseConstructor() as T
    case 'subject':
      return subjectConstructor() as T
    case 'poll':
      return pollConstructor() as T
    case 'task':
      return taskConstructor() as T
    case 'course-assignment':
      return courseAssignmentConstructor() as T
    default:
      return {} as T
  }
}

function answerConstructor(): Omit<Answer, 'id'> {
  return {
    slug: uuid(),
    content: emptyDelta(),
    word: '',
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

function materialConstructor(): Omit<Material, 'id'> {
  return {
    slug: uuid(),
    name: '',
    description: '',
    content: emptyDelta(),
    order: 0,
    files: [],
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

function courseConstructor(): Omit<Course, 'id'> {
  return {
    slug: uuid(),
    name: '',
    description: '',
    images: [],
    subject: null as unknown as Subject,
    author: null,
    chapters: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

function subjectConstructor(): Omit<Subject, 'id'> {
  return {
    name: '',
    color: ''
  }
}

function pollConstructor(): Omit<Poll, 'id' | 'votedCount' | 'votedUserIds'> {
  return {
    title: '',
    description: '',
    canSeeResults: [],
    canVote: [],
    questions: [],
    requireAuth: true,
    stopAt: new Date(),
    isStopped: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

function taskConstructor(): Omit<Task, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    slug: uuid(),
    order: 0,
    rightAnswer: '',
    content: emptyDelta(),
    highestScore: 0,
    type: 'word',
    isAnswerVisibleBeforeCheck: false
  }
}

function courseAssignmentConstructor(): Omit<CourseAssignment, 'id'> {
  return {
    courseId: '',
    studentId: '',
    assignerId: '',
    isArchived: false,
    createdAt: new Date()
  }
}
