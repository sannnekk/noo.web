import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { Video } from '@/core/data/entities/Video'
import type { VideoComment } from '@/core/data/entities/VideoComment'
import type { VideoAccessInfo } from '@/core/services/api/VideoService'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useVideoStore = defineStore('nootube-module:video', () => {
  const uiService = Core.Services.UI
  const videoService = Core.Services.Video

  const video = ref<Video | null>(null)
  const accessInfo = ref<VideoAccessInfo | null>(null)
  const comments = useSearch(fetchVideoComments, { immediate: false })
  const similarVideos = useSearch(fetchVideos)

  async function fetchVideo(videoId: Video['id']) {
    try {
      const response = await videoService.getVideo(videoId, {
        showLoader: true
      })

      video.value = response.data
      await fetchAccessInfo()
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

  const reactionsLoading = ref(false)

  async function react(reaction: string) {
    if (!video.value) {
      return
    }

    reactionsLoading.value = true

    try {
      const response = await videoService.toggleReaction(
        video.value.id,
        reaction
      )
      video.value.myReaction = reaction
      video.value.reactions = response!.data!
    } catch (error: any) {
      uiService.openErrorModal(
        'Не удалось отреагировать на видео',
        error.message
      )
    } finally {
      reactionsLoading.value = false
    }
  }

  async function fetchAccessInfo() {
    if (!video.value) {
      return
    }

    try {
      const response = await videoService.getAccessInfo(video.value.id, {
        showLoader: true
      })
      accessInfo.value = response.data
    } catch (error: any) {
      uiService.openErrorModal(
        'Ошибка при загрузке информации о доступе',
        error?.message
      )
    }
  }

  return {
    video,
    accessInfo,
    comments,
    similarVideos,
    fetchVideo,
    deleteComment,
    react,
    reactionsLoading
  }
})
