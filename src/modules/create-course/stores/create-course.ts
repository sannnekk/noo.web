import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Course } from '@/core/data/entities/Course'
import { v4 as uuid } from 'uuid'
import type { Material } from '@/core/data/entities/Material'
import { useRoute } from 'vue-router'
import { Core } from '@/core/Core'
import type { Chapter } from '@/core/data/entities/Chapter'

export const useCreateCourseStore = defineStore(
  'create-course-module:create-course',
  () => {
    const courseService = Core.Services.Course
    const uiService = Core.Services.UI
    const _route = useRoute()

    /**
     * Empty course
     */
    const emptyCourse = (): Course =>
      ({
        name: '',
        description: '',
        chapters: [],
        images: []
      } as unknown as Course)

    /**
     * Current course
     */
    const course = ref<Course>(emptyCourse() as any)

    /**
     * Name of the chapter to create
     */
    const newChapterName = ref('')

    /**
     * Visibility of the remove course modal
     */
    const removeCourseModalVisible = ref(false)

    /**
     * Load course
     */
    async function fetchCourse() {
      if (!_route.params.courseSlug) {
        course.value = emptyCourse()
        return
      }

      uiService.setLoading(true)

      try {
        const response = await courseService.getCourse(
          _route.params.courseSlug as string
        )

        if (!response.data) {
          uiService.openErrorModal('Курс не найден')
          return
        }

        course.value = response.data
      } catch (error: any) {
        course.value = emptyCourse()
        uiService.openErrorModal(
          'Произошла ошибка при загрузке курса',
          error.message
        )
      } finally {
        uiService.setLoading(false)
      }
    }

    /**
     * Add new chapter to the course
     */
    function addChapter() {
      if (!newChapterName.value.trim()) {
        uiService.openWarningModal('У главы должно быть название')
        return
      }

      course.value.chapters!.push({
        name: newChapterName.value,
        slug: uuid(),
        materials: []
      } as unknown as Chapter)

      newChapterName.value = ''
    }

    /**
     * Get chapter by slug
     */
    function getChapter(slug: string) {
      return course.value.chapters?.find((chapter) => chapter.slug === slug)
    }

    /**
     * Get material by chapter and material slug
     */
    function getMaterial(chapterSlug: string, materialSlug: string) {
      const chapter = getChapter(chapterSlug)

      if (!chapter) return

      if (materialSlug === 'new') {
        return emptyMaterial()
      }

      return chapter?.materials?.find(
        (material) => material.slug === materialSlug
      )
    }

    /**
     * Create empty material
     */
    function emptyMaterial(
      name?: string
    ): Omit<Material, 'id' | 'chapterId' | 'createdAt' | 'updatedAt'> {
      return {
        name: name || 'Новый материал',
        slug: uuid(),
        description: '',
        files: [],
        content: {
          ops: [
            {
              insert: '\n'
            }
          ]
        },
        order: 0
      }
    }

    /**
     * Add new material to the chapter
     */
    function addMaterial(chapter: Chapter) {
      chapter.materials!.push(
        emptyMaterial(
          `Новый материал ${chapter.materials?.length || 0}`
        ) as Material
      )
    }

    /**
     * Remove chapter from the course
     */
    function removeChapter(chapterSlug: string) {
      const chapterIndex = course.value.chapters?.findIndex(
        (chapter) => chapter.slug === chapterSlug
      )

      if (chapterIndex === undefined) return

      course.value.chapters?.splice(chapterIndex, 1)
    }

    /**
     * Remove material from the chapter
     */
    function removeMaterial(materialSlug: string) {
      const chapterIndex = course.value.chapters?.findIndex(
        (chapter) => chapter.slug === _route.params.chapterSlug
      )

      if (chapterIndex === undefined) return

      const materialIndex = course.value.chapters![
        chapterIndex
      ].materials?.findIndex((material) => material.slug === materialSlug)

      if (materialIndex === undefined) return

      course.value.chapters![chapterIndex].materials?.splice(materialIndex, 1)
    }

    /**
     * Save course
     */
    async function publishCourse() {
      if (!course.value.name.trim()) {
        uiService.openWarningModal('У курса должно быть название')
        return
      }

      if (!course.value.chapters?.length) {
        uiService.openWarningModal('Курс должен иметь хотя бы одну главу')
        return
      }

      for (const chapter of course.value.chapters!) {
        if (!chapter.name.trim()) {
          uiService.openWarningModal('У главы должно быть название')
          return
        }

        if (!chapter.materials?.length) {
          uiService.openWarningModal('Глава должна иметь хотя бы один материал')
          return
        }

        for (const material of chapter.materials!) {
          if (!material.name.trim()) {
            uiService.openWarningModal('У материала должно быть название')
            return
          }

          if (!material.content.ops.length) {
            uiService.openWarningModal('Материал не должен быть пустым')
            return
          }
        }
      }

      uiService.setLoading(true)

      course.value.chapters?.forEach((chapter, index) => {
        if (chapter.materials) {
          course.value.chapters![index].order = index
          course.value.chapters![index].materials = chapter.materials?.map(
            (material, i) => ({ ...material, order: i })
          )
        }
      })

      if (!_route.params.courseSlug) {
        try {
          await courseService.createCourse(course.value)
          uiService.openSuccessModal('Курс успешно создан')
        } catch (error: any) {
          uiService.openErrorModal(
            'Произошла ошибка при создании курса',
            error.message
          )
        } finally {
          uiService.setLoading(false)
        }
      } else {
        try {
          await courseService.updateCourse(course.value.id, course.value)
          uiService.openSuccessModal('Курс успешно обновлен')
        } catch (error: any) {
          uiService.openErrorModal(
            'Произошла ошибка при обновлении курса',
            error.message
          )
        } finally {
          uiService.setLoading(false)
        }
      }
    }

    /**
     * Remove course
     */
    async function removeCourse() {
      if (!removeCourseModalVisible.value) {
        removeCourseModalVisible.value = true
        return
      }

      uiService.setLoading(true)

      try {
        await courseService.deleteCourse(course.value.id)
        uiService.openSuccessModal('Курс успешно удален')
      } catch (error: any) {
        uiService.openErrorModal(
          'Произошла ошибка при удалении курса',
          error.message
        )
      } finally {
        uiService.setLoading(false)
        removeCourseModalVisible.value = false
      }
    }

    return {
      course,
      addChapter,
      publishCourse,
      removeCourse,
      newChapterName,
      emptyMaterial,
      getChapter,
      getMaterial,
      removeChapter,
      removeMaterial,
      addMaterial,
      removeCourseModalVisible,
      fetchCourse
    }
  }
)
