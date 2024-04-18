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
      v-if="studentsStore.resultsMeta.total"
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
import { useStudentsStore } from '../stores/students'
import { setPageTitle } from '@/core/utils/setPageTitle'
import { Core } from '@/core/Core'

const cols = [
  {
    title: '',
    keys: ['avatar.url', 'name'],
    type: 'avatar'
  },
  {
    title: 'Имя',
    keys: ['name'],
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
    title: 'Telegram',
    keys: ['telegramUsername'],
    type: 'link',
    design: 'telegram',
    linkTo: (user: User) => `https://t.me/${user.telegramUsername}`
  },
  {
    title: '',
    value: Core.Context.User?.role === 'mentor' ? 'Перейти' : 'Редактировать',
    type: 'link',
    design: 'secondary',
    linkTo: (user: User) => `/users/edit/${user.username}`
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
