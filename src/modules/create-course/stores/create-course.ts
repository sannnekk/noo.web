import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Course } from '@/core/data/entities/Course'
import { v4 as uuid } from 'uuid'
import type { Material } from '@/core/data/entities/Material'
import { useRoute } from 'vue-router'
import { Core } from '@/core/Core'

export const useCreateCourseStore = defineStore('create-course', () => {
  const courseService = Core.Services.Course
  const uiService = Core.Services.UI
  const _route = useRoute()

  /**
   * Current course
   */
  const course = ref<Course>({
    name: '',
    images: [],
    chapters: [] as Material[]
  } as any)

  /**
   * Name of the chapter to create
   */
  const newChapterName = ref('')

  /**
   * Visibility of the remove course modal
   */
  const removeCourseModalVisible = ref(false)

  /**
   * Current material
   */
  const currentMaterial = ref<Material>(emptyMaterial() as Material)

  /**
   * Load course if course slug is present in the route
   */
  watch(
    () => _route.params.courseSlug,
    async () => {
      if (_route.params.courseSlug) {
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
          uiService.openErrorModal(
            'Произошла ошибка при загрузке курса',
            error.message
          )
        } finally {
          uiService.setLoading(false)
        }
      }
    },
    { immediate: true }
  )

  /**
   * Load current material
   */
  watch(
    () => _route.params.materialSlug,
    () => {
      if (_route.params.materialSlug === 'new') {
        currentMaterial.value = emptyMaterial() as Material
      } else {
        currentMaterial.value = getMaterial(
          _route.params.chapterSlug as string,
          _route.params.materialSlug as string
        ) as Material
      }
    }
  )

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
    } as any)
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
   * Set material
   */
  function setMaterial(chapterSlug: string, material: Material) {
    const chapter = getChapter(chapterSlug)
    const materialIndex = chapter?.materials?.findIndex(
      (material) => material.slug === material.slug
    )

    if (materialIndex === undefined) return chapter!.materials!.push(material)

    chapter!.materials![materialIndex] = material
  }

  /**
   * Create empty material
   */
  function emptyMaterial(): Omit<
    Material,
    'id' | 'chapterId' | 'createdAt' | 'updatedAt'
  > {
    return {
      name: '',
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
  function addMaterial() {
    if (!currentMaterial.value.name.trim()) {
      uiService.openWarningModal('У материала должно быть название')
      return
    }

    const chapterSlug = _route.params.chapterSlug as string
    const chapter = getChapter(chapterSlug)

    if (!chapter) return

    chapter.materials!.push(currentMaterial.value)
    currentMaterial.value = emptyMaterial() as Material
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

    course.value.chapters?.forEach((chapter) => {
      if (!chapter.name.trim()) {
        uiService.openWarningModal('У главы должно быть название')
        return
      }

      if (!chapter.materials?.length) {
        uiService.openWarningModal('Глава должна иметь хотя бы один материал')
        return
      }

      chapter.materials?.forEach((material) => {
        if (!material.name.trim()) {
          uiService.openWarningModal('У материала должно быть название')
          return
        }

        if (!material.content.ops.length) {
          uiService.openWarningModal('Материал не должен быть пустым')
          return
        }
      })
    })

    uiService.setLoading(true)

    course.value.chapters?.forEach((chapter, index) => {
      if (chapter.materials) {
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
      await courseService.deleteCourse(course.value.slug)
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
    currentMaterial,
    emptyMaterial,
    getChapter,
    getMaterial,
    setMaterial,
    removeChapter,
    removeMaterial,
    addMaterial,
    removeCourseModalVisible
  }
})
