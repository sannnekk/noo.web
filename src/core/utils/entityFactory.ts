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
import type { UserSettings } from '../data/entities/UserSettings'
import type { Table } from '../data/entities/Table'

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
  | 'user-settings'
  | 'table'

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
  | UserSettings
  | Table

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
    case 'user-settings':
      return userSettingsConstructor() as T
    case 'table':
      return tableConstructor() as T
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
    detailedScore: {},
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
    materials: [entityFactory<Material>('material')],
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
    workSolveDeadline: null,
    workCheckDeadline: null,
    activateAt: null,
    isWorkAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    videos: []
  }
}

function courseConstructor(): Omit<Course, 'id'> {
  return {
    slug: uuid(),
    name: '',
    description: '',
    images: [],
    subject: null as unknown as Subject,
    authors: [],
    editors: [],
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
    canSeeResults: ['teacher'],
    canVote: ['student'],
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
    highestScore: 1,
    type: 'word',
    isAnswerVisibleBeforeCheck: false,
    isCheckOneByOneEnabled: false,
    checkingStrategy: 'type1'
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

function userSettingsConstructor(): Omit<UserSettings, 'id'> {
  return {
    backgroundImage: null,
    fontSize: 'medium'
  }
}

function tableConstructor(): Omit<Table, 'id'> {
  return {
    title: '',
    cells: []
  }
}
