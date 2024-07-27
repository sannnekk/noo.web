import type { Pagination } from '@/core/data/Pagination'
import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import { defineStore } from 'pinia'
import type { BlogPost, Reaction } from '@/core/data/entities/BlogPost'
import { ref } from 'vue'

export const useBlogStore = defineStore('blog-module:blog', () => {
  const blogService = Core.Services.Blog
  const uiService = Core.Services.UI

  /**
   * Search for posts
   */
  const { pagination, isListLoading, results, resultsMeta, trigger } =
    useSearch(fetchPosts, {
      debounceTime: 1000,
      immediate: true,
      initialPagination: {
        page: 1,
        limit: 5,
        sort: 'createdAt',
        order: 'DESC'
      }
    })

  /**
   * Fetch posts
   */
  async function fetchPosts(pagination: Pagination) {
    try {
      return await blogService.getPosts(pagination)
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при получении постов',
        error.message
      )
    }
  }

  /**
   * Delete post
   */
  async function deletePost(id: string) {
    try {
      await blogService.deletePost(id, { showLoader: true })
      trigger()
    } catch (error: any) {
      uiService.openErrorModal('Ошибка при удалении поста', error.message)
    }
  }

  /**
   * Reaction loading
   */
  const isReactionLoading = ref(false)

  /**
   * React to post
   */
  async function reactToPost(postOrId: string | BlogPost, reaction: Reaction) {
    isReactionLoading.value = true

    try {
      let postId: string = postOrId as string
      let post: BlogPost = postOrId as BlogPost

      if (typeof postOrId !== 'string') {
        postId = postOrId.id
      } else {
        post = results.value.find((post) => post.id === postId)!
      }

      const response = await blogService.toggleReaction(postId, reaction)

      if (post && response.data) {
        post.reactionCounts = response.data
        post.myReaction = post.myReaction === reaction ? undefined : reaction
      }
    } catch (error: any) {
      uiService.openErrorModal('Ошибка при реакции на пост', error.message)
    } finally {
      isReactionLoading.value = false
    }
  }

  return {
    results,
    resultsMeta,
    isListLoading,
    pagination,
    deletePost,
    isReactionLoading,
    reactToPost
  }
})
