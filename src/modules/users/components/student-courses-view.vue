<template>
  <div
    class="student-courses-view"
    v-auto-animate
  >
    <div class="student-courses-view__header">
      <h3>Курсы ученика</h3>
    </div>
    <div
      class="student-courses-view__list"
      v-if="!isLoading"
    >
      <entity-table
        :cols="cols"
        :data="courseAssignments"
        empty-text="Ученик не записан ни на один курс"
      />
      <common-button
        alignment="right"
        design="inline"
        v-if="Core.Context.roleIs(['admin', 'teacher'])"
        @click="addToCourseModalVisible = true"
      >
        Добавить на курс
      </common-button>
    </div>
    <div
      class="student-courses-view__list-loading"
      v-else
    >
      <loader-icon contrast />
    </div>
  </div>
  <sure-delete-modal
    v-model:visible="removeFromCourseModal.isVisible"
    @confirm="onCourseRemove()"
  >
    <template #title> Удаление ученика с курса </template>
    <template #text>
      Вы уверены, что хотите убрать ученика с курса "{{
        removeFromCourseModal.course?.name
      }}"?
    </template>
  </sure-delete-modal>
  <add-student-to-courses-modal
    v-if="Core.Context.roleIs(['admin', 'teacher'])"
    v-model:visible="addToCourseModalVisible"
    :user-id="userId"
    :course-slugs="courseSlugs"
    @add="onAddStudentToCourses($event)"
  />
</template>

<script setup lang="ts">
import addStudentToCoursesModal from './add-student-to-courses-modal.vue'
import type { ColType } from '@/components/structures/entity-table/entity-table.vue'
import { Core } from '@/core/Core'
import type { Course } from '@/core/data/entities/Course'
import type { CourseAssignment } from '@/core/data/entities/CourseAssignment'
import type { User } from '@/core/data/entities/User'
import { computed, ref, watch } from 'vue'

interface Props {
  userId: User['id']
}

const props = defineProps<Props>()

const courseService = Core.Services.Course
const uiService = Core.Services.UI

const courseAssignments = ref<CourseAssignment[]>([])
const courseSlugs = computed(() =>
  courseAssignments.value.map((assignment) => assignment.course!.slug)
)
const isLoading = ref(false)
const addToCourseModalVisible = ref(false)
const removeFromCourseModal = ref({
  isVisible: false,
  course: null as Course | null
})

const cols: ColType[] = [
  {
    title: '',
    type: 'image',
    value: (assignment: CourseAssignment) =>
      assignment.course!.images?.at(0) || null
  },
  {
    title: 'Название курса',
    type: 'text',
    value: (assignment: CourseAssignment) => assignment.course!.name
  },
  {
    title: 'Добавил(а)',
    type: 'text',
    value: (assignment: CourseAssignment) => assignment.assigner!.name
  },
  {
    title: 'Дата добавления',
    type: 'date',
    value: (assignment: CourseAssignment) => assignment.createdAt
  },
  {
    title: '',
    type: 'button',
    value: () => 'Убрать с курса',
    design: 'danger',
    alignment: 'right',
    action: (assignment: CourseAssignment) =>
      openRemoveCourseModal(assignment.course!)
  }
]

async function fetchStudentCourses() {
  isLoading.value = true

  try {
    const response = await courseService.getStudentCourses(props.userId)
    courseAssignments.value = response.data
  } catch (e: any) {
    uiService.openErrorModal(
      'Ошибка при загрузке курсов',
      'Попробуйте обновить страницу или обратитесь к администратору'
    )
  } finally {
    isLoading.value = false
  }
}

function openRemoveCourseModal(course: Course) {
  removeFromCourseModal.value.course = course
  removeFromCourseModal.value.isVisible = true
}

async function onCourseRemove() {
  if (!removeFromCourseModal.value.course) {
    return
  }

  const courseSlug = removeFromCourseModal.value.course.slug

  try {
    await courseService.removeStudentsFromCourse(courseSlug, [props.userId], {
      showLoader: true
    })
    await fetchStudentCourses()
    removeFromCourseModal.value.isVisible = false
  } catch (error: any) {
    uiService.openErrorModal('Не удалось убрать ученика с курса', error.message)
  }
}

async function onAddStudentToCourses(newCourseSlugs: Course['slug'][]) {
  const slugs = newCourseSlugs.filter(
    (slug) => !courseSlugs.value.includes(slug)
  )

  const toDeleteSlugs = courseSlugs.value.filter(
    (slug) => !newCourseSlugs.includes(slug)
  )

  try {
    for (const courseSlug of slugs) {
      await courseService.addStudentsToCourse(courseSlug, [props.userId], {
        showLoader: true
      })
    }

    for (const courseSlug of toDeleteSlugs) {
      await courseService.removeStudentsFromCourse(courseSlug, [props.userId], {
        showLoader: true
      })
    }

    await fetchStudentCourses()
  } catch (error: any) {
    uiService.openErrorModal(
      'Не удалось добавить ученика на курсы',
      error.message
    )
  }
}

watch(() => props.userId, fetchStudentCourses, { immediate: true })
</script>

<style scoped lang="sass">
.student-courses-view
	&__list-loading
		min-height: 200px
		font-size: 50px
		display: flex
		justify-content: center
		align-items: center
</style>
