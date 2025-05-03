<template>
  <div class="my-students-view">
    <div class="my-students-view__search">
      <search-field
        v-model="search.pagination.value.search"
        :is-loading="search.isListLoading.value"
      />
    </div>
    <div class="my-students-view__results">
      <entity-table
        :cols="cols"
        :data="search.results.value"
        :is-loading="search.isListLoading.value"
      />
    </div>
    <div
      class="my-students-view__pagination"
      v-if="
        search.resultsMeta.value.total &&
        search.pagination.value.page &&
        search.pagination.value.limit
      "
    >
      <list-pagination
        v-model:page="search.pagination.value.page"
        :total="search.resultsMeta.value.total"
        :limit="search.pagination.value.limit"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ColType } from '@/components/structures/entity-table/entity-table.vue'
import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { Subject } from '@/core/data/entities/Subject'
import type { User } from '@/core/data/entities/User'

type UserWithSubject = User & { subject: Subject }

const userService = Core.Services.User
const uiService = Core.Services.UI

const search = useSearch(fetchMyStudents)

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

async function fetchMyStudents(pagination: Pagination) {
  try {
    return await userService.getOwnStudents(undefined, pagination)
  } catch (error: any) {
    uiService.openErrorModal(
      'Произошла ошибка при получении списка студентов',
      error.message
    )
  }
}
</script>

<style lang="sass" scoped>
.my-students-view
  padding-top: 1em

  &__search
    :deep()
      input
        font-size: 0.8em

  &__results
    font-size: 0.9em
</style>
