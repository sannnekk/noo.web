<template>
  <div class="add-students-view">
    <div class="add-students-view__search">
      <search-field
        v-model="courseStudentsStore.studentSearch.pagination.search"
        :is-loading="courseStudentsStore.studentSearch.isListLoading"
      />
    </div>
    <div class="add-students-view__table">
      <entity-table
        :cols="cols"
        :data="courseStudentsStore.studentSearch.results as any"
        :is-loading="courseStudentsStore.studentSearch.isListLoading"
      />
    </div>
    <div
      class="add-students-view__pagination"
      v-if="
        courseStudentsStore.studentSearch.pagination.page &&
        courseStudentsStore.studentSearch.resultsMeta.total &&
        courseStudentsStore.studentSearch.pagination.limit
      "
    >
      <list-pagination
        v-model:page="courseStudentsStore.studentSearch.pagination.page"
        :total="courseStudentsStore.studentSearch.resultsMeta.total"
        :limit="courseStudentsStore.studentSearch.pagination.limit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ColType } from '@/components/structures/entity-table/entity-table.vue'
import { useCourseStudentsStore } from '../stores/course-students'
import type { User } from '@/core/data/entities/User'
import { reactive, ref } from 'vue'

const courseStudentsStore = useCourseStudentsStore()

const nowAddingList = ref<User['id'][]>([])
const nowRemovingList = ref<User['id'][]>([])

const cols = reactive<ColType[]>([
  {
    title: '',
    type: 'avatar',
    value: (user: User) => user
  },
  {
    title: 'Имя',
    value: (user: User) => {
      const name = user.name

      if (user.verificationToken) {
        return `<span title="Пользователь не подтвержден">❌</span> ${name}`
      }

      return name
    },
    type: 'text',
    linkTo: (user: User) => `/users/edit/${user.username}`
  },
  {
    title: 'Никнейм',
    type: 'text',
    value: (user: User) => user.username
  },
  {
    title: 'E-mail',
    type: 'text',
    value: (user: User) => user.email
  },
  {
    title: '',
    width: '200px',
    alignment: 'stretch',
    value: (user: User) => {
      return userInCourse(user) ? 'Добавлен' : 'Не на курсе'
    },
    type: 'button',
    design: (user: User) => {
      return userInCourse(user) ? 'primary' : 'secondary'
    },
    isLoading: (user: User) => {
      return (
        nowAddingList.value.includes(user.id) ||
        nowRemovingList.value.includes(user.id)
      )
    },
    action: async (user: User) => {
      if (userInCourse(user)) {
        nowRemovingList.value.push(user.id)
        await courseStudentsStore.removeStudent(user)
        nowRemovingList.value = nowRemovingList.value.filter(
          (id) => id !== user.id
        )
      } else {
        nowAddingList.value.push(user.id)
        await courseStudentsStore.addStudent(user)
        nowAddingList.value = nowAddingList.value.filter((id) => id !== user.id)
      }
    }
  }
])

function userInCourse(user: User) {
  if (!courseStudentsStore.course) {
    return false
  }

  return !!user.courseAssignments?.length
}
</script>

<style scoped lang="sass">
.add-students-view
  &__search
    padding: 1em
</style>
