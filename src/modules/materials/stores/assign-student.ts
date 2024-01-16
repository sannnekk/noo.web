import { useGlobalStore } from '@/store'
import type { Work } from '@/types/entities/Work'
import { http } from '@/utils/http'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMaterialsStore } from './materials'
import type { User } from '@/types/entities/User'

export const useAssignStudentsStore = defineStore(
  'assign-students-to-course',
  () => {
    const globalStore = useGlobalStore()
    const materialsStore = useMaterialsStore()

    const students = ref<User[]>([])
    const search = ref('')
    const selectedStudentIds = ref(
      (materialsStore.course?.students || []).map((student) => student.id)
    )
    const studentsCount = computed(
      () => (materialsStore.course?.students || []).length
    )
    const modalVisible = ref(false)

    watch(
      () => materialsStore.course,
      () => {
        selectedStudentIds.value = (materialsStore.course?.students || []).map(
          (student) => student.id
        )
      }
    )

    watch(
      search,
      () => {
        if (globalStore._userRole !== 'teacher') return
        http
          .get('/user/student/search', { search: search.value })
          .then((response) => {
            students.value = response
          })
          .catch(() => {
            globalStore.openModal('error', 'Ошибка при загрузке данных')
          })
      },
      { immediate: true }
    )

    function save() {
      globalStore.setLoading(true)

      http
        .patch(`/course/${materialsStore.course!.slug}/assign-students`, {
          studentIds: selectedStudentIds.value
        })
        .then(() =>
          globalStore.openModal(
            'success',
            'Студенты успешно присвоены и/или откреплены'
          )
        )
        .catch(() =>
          globalStore.openModal(
            'error',
            'Ошибка при присвоении/откреплении студентов'
          )
        )
        .finally(() => globalStore.setLoading(false))
    }

    return {
      students,
      search,
      save,
      modalVisible,
      selectedStudentIds,
      studentsCount
    }
  }
)
