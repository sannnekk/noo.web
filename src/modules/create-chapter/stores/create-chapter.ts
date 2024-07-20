import { Core } from '@/core/Core'
import { entityFactory } from '@/core/utils/entityFactory'
import { defineStore } from 'pinia'

export const useCreateChapterStore = defineStore(
  'create-chapter-module:create-chapter',
  () => {
    const uiService = Core.Services.UI
    const courseService = Core.Services.Course

    const chapter = ref<Chapter>(entityFactory<Chapter>('chapter'))

    async function saveChapter() {}

    return {
      chapter,
      saveChapter
    }
  }
)