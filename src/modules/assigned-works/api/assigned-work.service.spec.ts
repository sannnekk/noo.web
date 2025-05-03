// assigned-work.service.test.ts
import { Api } from '@/core/api/api.utils'
import { AssignedWorkService } from './assigned-work.service'
import { vi, describe, test, expect, type Mock, beforeEach } from 'vitest'
import type { IPagination } from '@/core/utils/pagination.utils'
import type {
  AssignedWorkAddMentorOptions,
  AssignedWorkAnswerEntity,
  AssignedWorkCommentEntity,
  AssignedWorkRemakeOptions
} from './assigned-work.types'

// Mock the entire API module
vi.mock('@/core/api/api.utils', () => ({
  Api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}))

describe('AssignedWorkService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('get', () => {
    test('should fetch assigned works with pagination', async () => {
      const mockPagination: IPagination = {
        page: 1,
        pageSize: 10,
        toQuery: () => ({ page: '1', pageSize: '10' })
      }
      const mockData = [{ id: '1' }]
      ;(Api.get as Mock).mockResolvedValue({ data: mockData })

      const result = await AssignedWorkService.get(mockPagination)

      expect(Api.get).toHaveBeenCalledWith('/assigned-works', {
        page: '1',
        pageSize: '10'
      })
      expect(result.data).toEqual(mockData)
    })

    test('should handle error response', async () => {
      const mockError = { error: { id: 'ERROR', statusCode: 500 } }
      ;(Api.get as Mock).mockResolvedValue(mockError)

      const result = await AssignedWorkService.get()
      expect(result.error).toEqual(mockError.error)
    })
  })

  describe('getById', () => {
    test('should fetch assigned work by ID', async () => {
      const mockId = '123'
      const mockData = { id: mockId }
      ;(Api.get as Mock).mockResolvedValue({ data: mockData })

      const result = await AssignedWorkService.getById(mockId)
      expect(Api.get).toHaveBeenCalledWith(`/assigned-works/${mockId}`)
      expect(result.data).toEqual(mockData)
    })
  })

  describe('getProgress', () => {
    test('should fetch progress by ID', async () => {
      const mockId = '123'
      const mockProgress = { solveStatus: 'solved' }
      ;(Api.get as Mock).mockResolvedValue({ data: mockProgress })

      const result = await AssignedWorkService.getProgress(mockId)
      expect(Api.get).toHaveBeenCalledWith(`/assigned-works/${mockId}/progress`)
      expect(result.data).toEqual(mockProgress)
    })
  })

  describe('remake', () => {
    test('should create remake with options', async () => {
      const mockId = '123'
      const mockOptions: AssignedWorkRemakeOptions = {
        includeOnlyFailedTasks: true
      }
      ;(Api.post as Mock).mockResolvedValue({ data: 'new-id' })

      const result = await AssignedWorkService.remake(mockId, mockOptions)
      expect(Api.post).toHaveBeenCalledWith(
        `/assigned-works/${mockId}/remake`,
        mockOptions
      )
      expect(result.data).toBe('new-id')
    })
  })

  describe('getOrCreateByMaterialId', () => {
    test('should call material endpoint', async () => {
      const mockMaterialId = 'material-123'
      ;(Api.get as Mock).mockResolvedValue({ data: 'work-id' })

      const result = await AssignedWorkService.getOrCreateByMaterialId(
        mockMaterialId
      )
      expect(Api.get).toHaveBeenCalledWith(
        `/assigned-works/material/${mockMaterialId}`
      )
      expect(result.data).toBe('work-id')
    })
  })

  describe('markSolved', () => {
    test('should call mark-solved endpoint', async () => {
      const mockId = '123'
      ;(Api.patch as Mock).mockResolvedValue({})

      await AssignedWorkService.markSolved(mockId)
      expect(Api.patch).toHaveBeenCalledWith(
        `/assigned-works/${mockId}/mark-solved`,
        undefined
      )
    })
  })

  describe('saveAnswer', () => {
    test('should post answer to answers endpoint', async () => {
      const mockAnswer: AssignedWorkAnswerEntity = {
        id: 'a1',
        taskId: 't1',
        richTextContent: null,
        wordContent: null,
        mentorComment: null,
        score: null,
        detailedScore: null,
        maxScore: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ;(Api.post as Mock).mockResolvedValue({ data: 'answer-id' })

      const result = await AssignedWorkService.saveAnswer(mockAnswer)
      expect(Api.post).toHaveBeenCalledWith(
        '/assigned-works/answers',
        mockAnswer
      )
      expect(result.data).toBe('answer-id')
    })
  })

  describe('addMentor', () => {
    test('should patch mentors endpoint with options', async () => {
      const mockId = '123'
      const mockMentorId = 'm1'
      const mockOptions: AssignedWorkAddMentorOptions = { notify: true }
      ;(Api.patch as Mock).mockResolvedValue({})

      await AssignedWorkService.addMentor(mockId, mockMentorId, mockOptions)
      expect(Api.patch).toHaveBeenCalledWith(
        `/assigned-works/${mockId}/mentors/${mockMentorId}`,
        mockOptions
      )
    })
  })

  describe('delete', () => {
    test('should call delete endpoint', async () => {
      const mockId = '123'
      ;(Api.delete as Mock).mockResolvedValue({})

      await AssignedWorkService.delete(mockId)
      expect(Api.delete).toHaveBeenCalledWith(`/assigned-works/${mockId}`)
    })
  })

  // Additional tests for other methods following the same pattern
  describe('markChecked', () => {
    test('should call mark-checked endpoint', async () => {
      const mockId = '123'
      ;(Api.patch as Mock).mockResolvedValue({})

      await AssignedWorkService.markChecked(mockId)
      expect(Api.patch).toHaveBeenCalledWith(
        `/assigned-works/${mockId}/mark-checked`,
        undefined
      )
    })
  })

  describe('saveComment', () => {
    test('should post comment to comments endpoint', async () => {
      const mockComment: AssignedWorkCommentEntity = {
        id: 'c1',
        content: null,
        type: 'mentor',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ;(Api.post as Mock).mockResolvedValue({ data: 'comment-id' })

      const result = await AssignedWorkService.saveComment(mockComment)
      expect(Api.post).toHaveBeenCalledWith(
        '/assigned-works/comments',
        mockComment
      )
      expect(result.data).toBe('comment-id')
    })
  })

  describe('shiftDeadline', () => {
    test('should call shift-deadline endpoint', async () => {
      const mockId = '123'
      ;(Api.patch as Mock).mockResolvedValue({})

      await AssignedWorkService.shiftDeadline(mockId)
      expect(Api.patch).toHaveBeenCalledWith(
        `/assigned-works/${mockId}/shift-deadline`,
        undefined
      )
    })
  })
})
