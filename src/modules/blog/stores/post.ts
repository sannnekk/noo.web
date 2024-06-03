import { Core } from '@/core/Core'
import type { BlogPost } from '@/core/data/entities/BlogPost'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

export const usePostStore = defineStore('blog-module:post', () => {
  const uiService = Core.Services.UI
  const blogService = Core.Services.Blog
  const route = useRoute()

  /**
   * Post object
   */
  const post = ref<BlogPost>()

  /**
   * Fetch post by id
   */
  async function fetchPost() {
    const id = route.params.id as string
    uiService.setLoading(true)

    try {
      const response = await blogService.getPost(id)

      if (!response.data) {
        throw new Error('Пост не найден')
      }

      post.value = response.data
    } catch (error: any) {
      uiService.openErrorModal('Ошибка при загрузке поста', error.message)
    } finally {
      uiService.setLoading(false)
    }
  }

  return { post, fetchPost }
})
