<template>
  <div class="index-students-view">
    <div class="index-students-view__search">
      <search-field
        v-model="studentsStore.pagination.search"
        :is-loading="studentsStore.isListLoading"
      />
    </div>
    <entity-table
      :cols="cols"
      :data="studentsStore.results"
      :is-loading="studentsStore.isListLoading"
    />
    <div
      class="index-students-view__pagination"
      v-if="
        studentsStore.resultsMeta.total &&
        studentsStore.pagination.page &&
        studentsStore.pagination.limit
      "
    >
      <list-pagination
        v-model:page="studentsStore.pagination.page"
        :total="studentsStore.resultsMeta.total"
        :limit="studentsStore.pagination.limit"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { User } from '@/core/data/entities/User'
import { useStudentsStore, type UserWithSubject } from '../stores/students'
import { setPageTitle } from '@/core/utils/setPageTitle'
import type { ColType } from '@/components/structures/entity-table/entity-table.vue'

const cols: ColType[] = [
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
        return `<span title="Пользователь не подтвержден">⛔</span> ${name}`
      }

      return name
    },
    type: 'text',
    linkTo: (user: User) => `/users/edit/${user.username}`
  },
  {
    title: 'Предмет',
    type: 'subject',
    value: (user: UserWithSubject) => user.subject
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
    title: 'Дата регистрации',
    type: 'date',
    value: (user: User) => user.createdAt
  }
]

const studentsStore = useStudentsStore()

setPageTitle('Мои ученики')
</script>

<style lang="sass" scoped>
.index-students-view
  &__search
    padding: 1em
</style>
