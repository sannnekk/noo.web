<template>
  <div class="index-students-view">
    <div class="index-students-view__search">
      <search-field
        v-model="usersStore.pagination.search"
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
import type { ColType } from '@/components/structures/entity-table.vue'
import type { MenuItem } from '@/components/widgets/more-widget.vue'
import { useRouter } from 'vue-router'

const usersStore = useUsersStore()
const router = useRouter()

setPageTitle('Пользователи')

const cols: ColType[] = [
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
    title: 'Роль',
    keys: ['role'],
    type: 'tag',
    tagFunction: (key: string, value: string | number | Date) => {
      switch (value) {
        case 'admin':
          return { text: 'Администратор', type: 'danger' }
        case 'teacher':
          return { text: 'Преподаватель', type: 'success' }
        case 'mentor':
          return { text: 'Куратор', type: 'info' }
        case 'student':
        default:
          return { text: 'Ученик', type: 'info' }
      }
    }
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
</style>
