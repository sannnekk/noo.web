import { describe, it, expect, vi } from 'vitest'
import { MediaService } from './media.service'
import { Api } from '../api.utils'

vi.mock('../api.utils', () => ({
  Api: {
    fileUpload: vi.fn(),
    delete: vi.fn()
  }
}))

describe('MediaService', () => {
  describe('upload', () => {
    it('should call Api.fileUpload with the correct arguments and return the response', async () => {
      const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' })
      const mockResponse = { data: { id: '123', name: 'test.txt' } }
      vi.mocked(Api.fileUpload).mockResolvedValue(mockResponse)

      const response = await MediaService.upload(mockFile)

      expect(Api.fileUpload).toHaveBeenCalledWith('/media/upload', [mockFile])
      expect(response).toEqual(mockResponse)
    })
  })

  describe('delete', () => {
    it('should call Api.delete with the correct arguments and return the response', async () => {
      const mockMediaId = '123'

      await MediaService.delete(mockMediaId)

      expect(Api.delete).toHaveBeenCalledWith(`/media/${mockMediaId}`)
    })
  })
})
