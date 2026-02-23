<template>
  <sure-modal
    v-model:visible="visibilityModel"
    @confirm="assignMentor()"
    @cancel="selectedMentorIds = []"
  >
    <template #title>
      <div class="subject"><subject-name :subject="subject" /></div>
      <h2>Выбор куратора для учника <br />{{ student.name }}</h2>
    </template>
    <template #text>
      <div class="search">
        <search-field
          v-model="search.pagination.value.search"
          :is-loading="search.isListLoading.value"
        />
      </div>
      <div class="list">
        <check-list
          v-model="selectedMentorIds"
          :items="search.results.value"
          item-label-key="name,username"
          item-key="id"
        />
      </div>
      <div class="pagination">
        <list-pagination
          v-model:page="search.pagination.value.page"
          :total="search.resultsMeta.value.total"
          :limit="search.pagination.value.limit"
        />
      </div>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { Subject } from '@/core/data/entities/Subject'
import type { User } from '@/core/data/entities/User'
import { computed, ref } from 'vue'

interface Props {
  visible?: boolean
  subject: Subject
  currentMentor: User | null
  student: User
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'mentor-assigned'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const visibilityModel = computed({
  get: () => props.visible,
  set: (value: boolean) => emits('update:visible', value)
})

const search = useSearch(searchMentors)
const selectedMentorIds = ref<User['id'][]>([])

async function searchMentors(pagination?: Pagination) {
  if (Core.Context.roleIs(['student'])) {
    return
  }

  try {
    return Core.Services.User.getMentors(pagination)
  } catch (error: any) {
    Core.Services.UI.openErrorModal(
      'Не удалось загрузить список кураторов',
      error.message
    )
  }
}

async function assignMentor() {
  const mentorId = selectedMentorIds.value.at(0)
  const studentId = props.student.id
  const subjectId = props.subject.id

  try {
    if (!mentorId) {
      throw new Error('Не выбран куратор')
    }

    if (!studentId) {
      throw new Error('Не указан ученик')
    }

    if (!subjectId) {
      throw new Error('Не указан предмет')
    }

    await Core.Services.User.assignMentor(studentId, mentorId, subjectId, {
      showLoader: true
    })

    emits('mentor-assigned')
  } catch (error: any) {
    Core.Services.UI.openErrorModal(
      'Не удалось назначить куратора',
      error.message
    )
  }
}
</script>

<style lang="sass" scoped>
.list
	margin: 1em 0 0 0
</style>
