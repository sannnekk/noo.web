<template>
  <div class="index-students-view">
    <div class="index-students-view__search">
      <search-field
        v-if="typeof usersStore.pagination.search !== 'undefined'"
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
  <assign-mentor-modal
    v-model:visible="assignMentorModalData.visible"
    :current-mentor="assignMentorModalData.mentor || null"
    :user-id="assignMentorModalData.user?.id"
    @confirmed="onMentorSelectConfirm($event)"
  />
</template>

<script lang="ts" setup>
import AssignMentorModal from '../components/assign-mentor-modal.vue'
import type { User } from '@/core/data/entities/User'
import { useUsersStore } from '../stores/users'
import { setPageTitle } from '@/core/utils/setPageTitle'
import type { ColType } from '@/components/structures/entity-table/entity-table.vue'
import type { MenuItem } from '@/components/widgets/more-widget.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const usersStore = useUsersStore()
const router = useRouter()

const assignMentorModalData = ref({
  visible: false,
  mentor: null as User | null,
  user: null as User | null
})

setPageTitle('Пользователи')

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

      if (user.mentor && user.role === 'student') {
        return `${name}<br><small>Куратор: ${user.mentor.name}</small>`
      }

      return name
    },
    type: 'text'
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

function onMentorSelectConfirm(newMentor: User | null) {
  for (const user of usersStore.results) {
    if (user.id === assignMentorModalData.value.user!.id) {
      user.mentor = newMentor!
    }
  }
}
</script>

<style lang="sass" scoped>
.index-students-view
  &__search
    padding: 1rem
</style>
