import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { Video } from '@/core/data/entities/Video'
import type { VideoComment } from '@/core/data/entities/VideoComment'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useVideoStore = defineStore('nootube-module:video', () => {
  const uiService = Core.Services.UI
  const videoService = Core.Services.Video

  const video = ref<Video | null>(null)
  const comments = useSearch(fetchVideoComments, { immediate: false })
  const similarVideos = useSearch(fetchVideos)

  async function fetchVideo(videoId: Video['id']) {
    try {
      const response = await videoService.getVideo(videoId, {
        showLoader: true
      })

      video.value = response.data
    } catch (error: any) {
      uiService.openErrorModal('Ошибка при загрузке видео', error?.message)
    }
  }

  async function fetchVideos(pagination?: Pagination) {
    try {
      return videoService.getVideos(pagination)
    } catch (error: any) {
      uiService.openErrorModal(
        'Ошибка при загрузке похожих видео',
        error?.message
      )
    }
  }

  async function fetchVideoComments(pagination?: Pagination) {
    if (!video.value) {
      return
    }

    try {
      return videoService.getVideoComments(video.value.id, pagination)
    } catch (error: any) {
      uiService.openErrorModal(
        'Ошибка при загрузке комментариев',
        error?.message
      )
    }
  }

  async function deleteComment(commentId: VideoComment['id']) {
    try {
      await videoService.deleteComment(commentId, { showLoader: true })
      comments.trigger()
    } catch (error: any) {
      uiService.openErrorModal(
        'Ошибка при удалении комментария',
        error?.message
      )
    }
  }

  return {
    video,
    comments,
    similarVideos,
    fetchVideo,
    deleteComment
  }
})
