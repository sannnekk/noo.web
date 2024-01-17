import { defineStore } from 'pinia'
import { ref, reactive, watch, computed } from 'vue'
import { useGlobalStore } from '@/store'
import type { Course } from '@/types/entities/Course'
import { v4 as uuid } from 'uuid'
import type { Material } from '@/types/entities/Material'
import { useRoute } from 'vue-router'
import { http } from '@/utils/http'

export const useCreateCourseStore = defineStore('create-course', () => {
  const _globalStore = useGlobalStore()
  const _route = useRoute()

  const course = ref<Course>({
    name: '',
    chapters: [] as Material[]
  } as any)

  const newChapterName = ref('')

  const currentMaterial = ref<Material>(emptyMaterial() as Material)

  watch(
    () => _route.params.courseSlug,
    () => {
      if (_route.params.courseSlug) {
        _globalStore.setLoading(true)
        http
          .get(`/course/${_route.params.courseSlug}`)
          .then((data) => {
            course.value = data
          })
          .catch(() => {
            _globalStore.openModal(
              'error',
              'Произошла ошибка при загрузке курса'
            )
          })
          .finally(() => {
            _globalStore.setLoading(false)
          })
      }
    },
    { immediate: true }
  )

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

  function addChapter() {
    if (!newChapterName.value.trim()) {
      _globalStore.openModal('error', 'У главы должно быть название')
      return
    }

    course.value.chapters!.push({
      name: newChapterName.value,
      slug: uuid(),
      materials: []
    } as any)
    newChapterName.value = ''
  }

  function getChapter(slug: string) {
    return course.value.chapters?.find((chapter) => chapter.slug === slug)
  }

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

  function setMaterial(chapterSlug: string, material: Material) {
    const chapter = getChapter(chapterSlug)
    const materialIndex = chapter?.materials?.findIndex(
      (material) => material.slug === material.slug
    )

    if (materialIndex === undefined) return chapter!.materials!.push(material)

    chapter!.materials![materialIndex] = material
  }

  function emptyMaterial(): Omit<
    Material,
    'id' | 'chapterId' | 'createdAt' | 'updatedAt'
  > {
    return {
      name: '',
      slug: uuid(),
      description: '',
      content: {
        ops: [
          {
            insert: '\n'
          }
        ]
      }
    }
  }

  function addMaterial() {
    if (!currentMaterial.value.name.trim()) {
      _globalStore.openModal('error', 'У материала должно быть название')
      return
    }

    const chapterSlug = _route.params.chapterSlug as string
    const chapter = getChapter(chapterSlug)

    if (!chapter) return

    chapter.materials!.push(currentMaterial.value)
    currentMaterial.value = emptyMaterial() as Material
  }

  function removeChapter(chapterSlug: string) {
    const chapterIndex = course.value.chapters?.findIndex(
      (chapter) => chapter.slug === chapterSlug
    )

    if (chapterIndex === undefined) return

    course.value.chapters?.splice(chapterIndex, 1)
  }

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

  function publishCourse() {
    if (!course.value.name.trim()) {
      _globalStore.openModal('error', 'У курса должно быть название')
      return
    }

    if (!course.value.chapters?.length) {
      _globalStore.openModal('error', 'Курс должен иметь хотя бы одну главу')
      return
    }

    course.value.chapters?.forEach((chapter) => {
      if (!chapter.name.trim()) {
        _globalStore.openModal('error', 'У главы должно быть название')
        return
      }

      if (!chapter.materials?.length) {
        _globalStore.openModal(
          'error',
          'Глава должна иметь хотя бы один материал'
        )
        return
      }

      chapter.materials?.forEach((material) => {
        if (!material.name.trim()) {
          _globalStore.openModal('error', 'У материала должно быть название')
          return
        }

        if (!material.content.ops.length) {
          _globalStore.openModal('error', 'Материал не должен быть пустым')
          return
        }
      })
    })

    _globalStore.setLoading(true)

    if (!_route.params.courseSlug) {
      http
        .post('/course', course.value)
        .then(() => {
          _globalStore.openModal('success', 'Курс успешно создан')
        })
        .catch(() => {
          _globalStore.openModal('error', 'Произошла ошибка при создании курса')
        })
        .finally(() => {
          _globalStore.setLoading(false)
        })
    } else {
      http
        .patch(`/course/${course.value.id}`, course.value)
        .then(() => {
          _globalStore.openModal('success', 'Курс успешно обновлен')
        })
        .catch(() => {
          _globalStore.openModal(
            'error',
            'Произошла ошибка при обновлении курса'
          )
        })
        .finally(() => {
          _globalStore.setLoading(false)
        })
    }
  }

  return {
    course,
    addChapter,
    publishCourse,
    newChapterName,
    currentMaterial,
    emptyMaterial,
    getChapter,
    getMaterial,
    setMaterial,
    removeChapter,
    removeMaterial,
    addMaterial
  }
})
