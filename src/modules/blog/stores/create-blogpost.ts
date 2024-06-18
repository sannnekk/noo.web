import type { BlogPost } from '@/core/data/entities/BlogPost'
import { emptyDelta } from '@/core/utils/deltaHelpers'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/core/data/entities/User'
import { Core } from '@/core/Core'
import type { Poll } from '@/core/data/entities/Poll'

export const useCreateBlogpostStore = defineStore(
  'blog-module:create-blogpost',
  () => {
    const uiService = Core.Services.UI
    const blogService = Core.Services.Blog

    /**
     * Creating or editing blogpost object
     */
    const blogpost = ref<BlogPost>(emptyBlogpost())

    /**
     * Mode of the store
     */
    const mode = ref<'create' | 'edit'>('create')

    /**
     * Set mode of the store
     */
    function setMode(newMode: typeof mode.value) {
      mode.value = newMode
    }

    /**
     * Fetch blogpost by id
     */
    async function fetchBlogpost(id: string) {
      uiService.setLoading(true)

      try {
        const response = await blogService.getPost(id)

        if (!response.data) {
          throw new Error('Пост не найден')
        }

        blogpost.value = response.data
      } catch (error: any) {
        uiService.openErrorModal('Ошибка при загрузке поста', error.message)
      } finally {
        uiService.setLoading(false)
      }
    }

    /**
     * Reset blogpost object
     */
    function reset() {
      blogpost.value = emptyBlogpost()
    }

    /**
     * Create empty blogpost object
     */
    function emptyBlogpost(): BlogPost {
      return {
        id: undefined as unknown as string,
        title: '',
        content: emptyDelta(),
        reactionCounts: undefined as unknown as BlogPost['reactionCounts'],
        author: undefined as unknown as User,
        tags: [],
        createdAt: undefined as unknown as Date,
        updatedAt: undefined as unknown as Date
      }
    }

    /**
     * Create empty poll object
     */
    function emptyPoll(): Poll {
      return {
        id: undefined as unknown as string,
        title: '',
        description: '',
        requireAuth: true,
        stopAt: new Date(),
        isStopped: false,
        createdAt: undefined as unknown as Date,
        updatedAt: undefined as unknown as Date,
        questions: [],
        canSeeResults: ['everyone'],
        canVote: ['everyone'],
        votedUserIds: []
      }
    }

    /**
     * Save blogpost
     */
    async function saveBlogpost() {
      uiService.setLoading(true)

      try {
        if (mode.value === 'create') {
          blogpost.value.id = undefined as unknown as string

          validatePost(blogpost.value)

          const payload = blogpost.value

          if (payload.poll) {
            validatePoll(payload.poll)

            payload.poll.questions = sortQuestions(payload.poll.questions)
          }

          await blogService.createPost(payload)
        } else {
          await blogService.updatePost(blogpost.value.id, blogpost.value)
        }

        uiService.openSuccessModal(
          'Пост успешно сохранен',
          'Пост успешно сохранен и доступен для просмотра',
          [
            {
              label: 'Вернуться к ленте',
              design: 'primary',
              handler: () => location.replace('/blog')
            }
          ]
        )
      } catch (error: any) {
        uiService.openErrorModal('Ошибка при сохранении поста', error.message)
      } finally {
        uiService.setLoading(false)
      }
    }

    /**
     * Sort questions by adding order field
     */
    function sortQuestions(questions: Poll['questions']) {
      return questions.map((question, index) => ({
        ...question,
        order: index
      }))
    }

    /**
     * Add poll to blogpost
     */
    async function addPoll() {
      blogpost.value.poll = emptyPoll()
    }

    /**
     * Remove poll from blogpost
     */
    async function removePoll() {
      blogpost.value.poll = undefined
    }

    /**
     * Validate poll object
     */
    function validatePoll(poll: Poll) {
      if (!poll.title || poll.title.length === 0) {
        throw new Error('Опрос должен содержать название')
      }

      if (!poll.stopAt) {
        throw new Error('Опрос должен содержать дату окончания')
      }

      if (poll.questions.length === 0) {
        throw new Error('Опрос должен содержать хотя бы один вопрос')
      }

      if (poll.canSeeResults.length === 0) {
        throw new Error(
          'Опрос должен содержать хотя бы один вариант доступа к результатам'
        )
      }

      if (poll.canVote.length === 0) {
        throw new Error(
          'Опрос должен содержать хотя бы один вариант доступа к голосованию'
        )
      }

      poll.questions.forEach((question) => {
        question.id = undefined as unknown as string

        switch (question.type) {
          case 'choice':
            if (!question.choices || question.choices.length === 0) {
              throw new Error(
                'Вопрос с выбором должен содержать хотя бы один вариант ответа'
              )
            }
            if (question.choices.some((choice) => choice.includes('|'))) {
              throw new Error('Варианты ответа не могут содержать символ "|"')
            }
            break
          case 'rating':
            if (
              question.minRating === undefined ||
              question.maxRating === undefined
            ) {
              throw new Error(
                'Вопрос с рейтингом должен содержать минимальное и максимальное значение'
              )
            }
            break
          case 'file':
            if (question.maxFileSize === undefined) {
              throw new Error(
                'Вопрос с файлом должен содержать максимальный размер файла'
              )
            }
            if (question.maxFileCount === undefined) {
              throw new Error(
                'Вопрос с файлом должен содержать максимальное количество файлов'
              )
            }
            break
          case 'date':
            break
          case 'number':
            if (
              question.minValue === undefined ||
              question.maxValue === undefined
            ) {
              throw new Error(
                'Вопрос с числом должен содержать минимальное и максимальное значение'
              )
            }
            break
          case 'text':
            break
          default:
            throw new Error('Неизвестный тип вопроса')
        }
      })
    }

    /**
     * Validate blogpost object
     */
    function validatePost(post: BlogPost) {
      if (!post.title || post.title.length === 0) {
        throw new Error('Пост должен содержать название')
      }

      if (!post.content || post.content.ops.length === 0) {
        throw new Error('Пост должен содержать контент')
      }

      if (post.tags.length === 0) {
        throw new Error('Пост должен содержать хотя бы один тег')
      }
    }

    return {
      blogpost,
      fetchBlogpost,
      saveBlogpost,
      mode,
      setMode,
      reset,
      addPoll,
      removePoll
    }
  }
)
