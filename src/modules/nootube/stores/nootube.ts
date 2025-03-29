import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { Video } from '@/core/data/entities/Video'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNooTubeStore = defineStore('nootube-module:nootube', () => {
  const uiService = Core.Services.UI
  const videoService = Core.Services.Video

  const activeTabIndex = ref(0)

  const videoSearch = useSearch(fetchVideos)

  const savedVideoSearch = useSearch(fetchSavedVideos)

  async function fetchVideos(pagination?: Pagination) {
    try {
      return videoService.getVideos(pagination)
    } catch (error: any) {
      uiService.openErrorModal('Ошибка при загрузке видео', error.message)
    }
  }

  async function fetchSavedVideos(pagination?: Pagination) {
    try {
      return videoService.getSavedVideos(pagination)
    } catch (error: any) {
      uiService.openErrorModal(
        'Ошибка при загрузке сохраненных видео',
        error.message
      )
    }
  }

  async function deleteVideo(videoId: Video['id']) {
    try {
      await videoService.deleteVideo(videoId, { showLoader: true })
      videoSearch.trigger()
    } catch (error: any) {
      uiService.openErrorModal('Ошибка при удалении видео', error.message)
    }
  }

  return {
    videoSearch,
    savedVideoSearch,
    deleteVideo,
    activeTabIndex
  }
})
