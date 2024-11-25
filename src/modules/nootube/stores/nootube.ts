import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import { defineStore } from 'pinia'

export const useNooTubeStore = defineStore('nootube-module:nootube', () => {
  const uiService = Core.Services.UI
  const videoService = Core.Services.Video

  const videoSearch = useSearch(fetchVideos)

  async function fetchVideos(pagination: Pagination) {
    try {
      return videoService.getVideos(pagination)
    } catch (error: any) {
      uiService.openErrorModal('Ошибка при загрузке видео', error.message)
    }
  }

  return {
    videoSearch
  }
})
