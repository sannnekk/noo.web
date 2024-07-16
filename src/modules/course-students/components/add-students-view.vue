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
import type { ColType } from '@/components/structures/entity-table.vue'
import { useCourseStudentsStore } from '../stores/course-students'
import type { User } from '@/core/data/entities/User'
import { reactive, ref } from 'vue'

const courseStudentsStore = useCourseStudentsStore()

const nowAddingList = ref<User['id'][]>([])
const nowRemovingList = ref<User['id'][]>([])

const cols: ColType[] = reactive([
  {
    title: '',
    keys: ['telegramAvatarUrl', 'name'],
    type: 'avatar'
  },
  {
    title: 'Имя',
    value: (user: User) => {
      const name = user.name

      if (user.verificationToken) {
        return `<span title="Пользователь не подтвержден">⛔</span> ${name}`
      }

      if (user.mentor && user.role === 'student') {
        return `${name}<br><small>Куратор: ${user.mentor.name}</small>`
      }

      return name
    },
    type: 'text'
  },
  {
    title: 'Никнейм',
    keys: ['username'],
    type: 'text'
  },
  {
    title: 'E-mail',
    keys: ['email'],
    type: 'text'
  },
  {
    title: '',
    width: '200px',
    alignment: 'stretch',
    value: (user: User) => {
      return userInCourse(user.id) ? 'Добавлен' : 'Не на курсе'
    },
    type: 'link',
    design: (user: User) => {
      return userInCourse(user.id) ? 'primary' : 'secondary'
    },
    isLoading: (user: User) => {
      return (
        nowAddingList.value.includes(user.id) ||
        nowRemovingList.value.includes(user.id)
      )
    },
    action: async (user: User) => {
      if (userInCourse(user.id)) {
        nowRemovingList.value.push(user.id)
        await courseStudentsStore.removeStudent(user.id)
        nowRemovingList.value = nowRemovingList.value.filter(
          (id) => id !== user.id
        )
      } else {
        nowAddingList.value.push(user.id)
        await courseStudentsStore.addStudent(user.id)
        nowAddingList.value = nowAddingList.value.filter((id) => id !== user.id)
      }
    }
  }
])

function userInCourse(userId: User['id']) {
  return courseStudentsStore.course!.studentIds!.some((id) => id === userId)
}
</script>

<style scoped lang="sass">
.add-students-view
  &__search
    padding: 1em
</style>
