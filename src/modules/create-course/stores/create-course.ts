import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Course } from '@/core/data/entities/Course'
import { v4 as uuid } from 'uuid'
import type { Material } from '@/core/data/entities/Material'
import { useRoute, useRouter } from 'vue-router'
import { Core } from '@/core/Core'
import type { Chapter } from '@/core/data/entities/Chapter'
import type { Pagination } from '@/core/data/Pagination'
import { useCoursesStore } from '@/modules/courses/stores/courses'

export const useCreateCourseStore = defineStore(
  'create-course-module:create-course',
  () => {
    const courseService = Core.Services.Course
    const userService = Core.Services.User
    const uiService = Core.Services.UI
    const _route = useRoute()
    const _router = useRouter()

    const coursesStore = useCoursesStore()

    /**
     * Empty course
     */
    const emptyCourse = (): Course =>
      ({
        name: '',
        description: '',
        chapters: [],
        images: [],
        subject: null
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

      try {
        const response = await courseService.getCourse(
          _route.params.courseSlug as string,
          { showLoader: true }
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
     * Change chapter name
     */
    function changeChapterName(chapterSlug: string, name: string) {
      const chapter = getChapter(chapterSlug)

      if (!chapter) return

      chapter.name = name
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
        order: 0,
        isActive: true,
        activateAt: null,
        isWorkAvailable: true,
        workSolveDeadline: null,
        workCheckDeadline: null
      } as Omit<Material, 'id' | 'chapterId' | 'createdAt' | 'updatedAt'>
    }

    /**
     * Add new material to the chapter
     */
    function addMaterial(chapter?: Chapter) {
      if (!chapter) {
        chapter = getChapter(_route.params.chapterSlug as string)
      }

      if (!chapter) return

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

      if (!course.value.subject) {
        uiService.openWarningModal('У курса должен быть предмет')
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

      course.value.chapters?.forEach((chapter, index) => {
        if (chapter.materials) {
          chapter.order = index
          chapter.materials = chapter.materials?.map((material, i) => ({
            ...material,
            order: i
          }))
        }
      })

      if (!_route.params.courseSlug) {
        try {
          await courseService.createCourse(course.value, { showLoader: true })
          uiService.openSuccessModal('Курс успешно создан', '', [
            {
              label: 'Вернуться к списку курсов',
              design: 'primary',
              handler: () => {
                coursesStore.triggerSearch()
                _router.push('/courses')
              }
            }
          ])
        } catch (error: any) {
          uiService.openErrorModal(
            'Произошла ошибка при создании курса',
            error.message
          )
        }
      } else {
        try {
          await courseService.updateCourse(course.value.id, course.value, {
            showLoader: true
          })
          uiService.openSuccessModal('Курс успешно обновлен', '', [
            {
              label: 'Вернуться к списку курсов',
              design: 'primary',
              handler: () => {
                coursesStore.triggerSearch()
                _router.push('/courses')
              }
            }
          ])
        } catch (error: any) {
          uiService.openErrorModal(
            'Произошла ошибка при обновлении курса',
            error.message
          )
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

      try {
        await courseService.deleteCourse(course.value.id, { showLoader: true })
        uiService.openSuccessModal('Курс успешно удален', '', [
          {
            label: 'Вернуться к списку курсов',
            design: 'primary',
            handler: () => {
              coursesStore.triggerSearch()
              _router.push('/courses')
            }
          }
        ])
      } catch (error: any) {
        uiService.openErrorModal(
          'Произошла ошибка при удалении курса',
          'Для удаления курса необходимо сначала убрать всех учеников'
        )
      } finally {
        removeCourseModalVisible.value = false
      }
    }

    /**
     * Fetch teachers
     */
    async function fetchTeachers(pagination: Pagination) {
      try {
        return await userService.getTeachers(pagination)
      } catch (error) {
        uiService.openErrorModal('Произошла ошибка при загрузке учителей')
      }
    }

    return {
      course,
      addChapter,
      changeChapterName,
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
      fetchCourse,
      fetchTeachers
    }
  }
)
