<template>
  <div class="index-students-view">
    <div class="index-students-view__search">
      <search-field
        v-model="usersStore.pagination.search"
        :is-loading="usersStore.isListLoading"
      />
    </div>
    <div class="index-students-view__filters">
      <search-filters
        v-model:pagination="usersStore.pagination"
        :filters="filters"
        :is-loading="usersStore.isListLoading"
      />
    </div>
    <div class="index-students-view__table">
      <entity-table
        :cols="cols"
        :data="usersStore.results as any[]"
        :is-loading="usersStore.isListLoading"
        :actions="actions"
      />
    </div>
    <div
      class="index-students-view__pagination"
      v-if="
        usersStore.resultsMeta.total &&
        usersStore.pagination.limit &&
        usersStore.pagination.page
      "
    >
      <list-pagination
        v-model:page="usersStore.pagination.page"
        :total="usersStore.resultsMeta.total"
        :limit="usersStore.pagination.limit"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { User } from '@/core/data/entities/User'
import { useUsersStore } from '../stores/users'
import { setPageTitle } from '@/core/utils/setPageTitle'
import type { ColType } from '@/components/structures/entity-table/entity-table.vue'
import type { MenuItem } from '@/components/widgets/more-widget.vue'
import { useRouter } from 'vue-router'
import type { SearchFilter } from '@/components/search/filters/SearchFilter'
import { ref } from 'vue'

const usersStore = useUsersStore()
const router = useRouter()

setPageTitle('Пользователи')

const filters: SearchFilter[] = [
  {
    name: 'Роль',
    type: 'arr',
    key: 'role',
    arrayOptions: [
      { label: 'Администратор', value: 'admin' },
      { label: 'Преподаватель', value: 'teacher' },
      { label: 'Куратор', value: 'mentor' },
      { label: 'Ученик', value: 'student' }
    ]
  },
  {
    name: 'Дата регистрации',
    type: 'range',
    key: 'createdAt',
    rangeType: 'date',
    rangeValues: [new Date(), new Date()]
  },
  {
    name: 'Заблокированные',
    type: 'boolean',
    key: 'isBlocked',
    booleanLabels: ['Нет', 'Да']
  }
]

const cols: ColType[] = [
  {
    title: '',
    type: 'avatar',
    value: (user: User) => user
  },
  {
    title: 'Имя',
    linkTo: (user: User) => `/users/edit/${user.username}`,
    value: (user: User) => user,
    type: 'user'
  },
  {
    title: 'Роль',
    type: 'text',
    value: (user: User) => {
      switch (user.role) {
        case 'admin':
          return "<span style='color: var(--danger)'>Администратор</span>"
        case 'teacher':
          return "<span style='color: var(--success)'>Преподаватель</span>"
        case 'mentor':
          return "<span style='color: var(--warning)'>Куратор</span>"
        case 'student':
        default:
          return "<span style='color: var(--text-light)'>Ученик</span>"
      }
    }
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
    title: 'Количество курсов',
    type: 'text',
    value: (user: User) => (user.courseAsStudentIds || []).length.toString()
  }
]

function actions(row: User): MenuItem[] {
  return [
    {
      title: 'Редактировать',
      icon: 'edit',
      action: () => {
        router.push(`/users/edit/${row.username}`)
      }
    },
    /* {
      title: 'Присвоить/изменить куратора',
      icon: 'user',
      if: row.role === 'student',
      action: () => {
        assignMentorModalData.value = {
          visible: true,
          mentor: row.mentor || null,
          user: row
        }
      }
    }, */
    {
      title: 'Телеграм',
      icon: 'telegram-blue',
      if: !!row.telegramUsername,
      action: () => {
        window.open(`https://t.me/${row.telegramUsername}`, '_blank')?.focus()
      }
    }
  ]
}
</script>

<style lang="sass" scoped>
.index-students-view
  &__search
    padding: 1rem

  &__filters
    padding: 1rem
</style>
