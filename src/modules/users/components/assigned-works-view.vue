<template>
  <div
    class="assigned-works-view"
    v-auto-animate
  >
    <div class="assigned-works-view__search">
      <search-field v-model="search.pagination.value.search" />
    </div>
    <div class="assigned-works-view__filters">
      <search-filters
        v-model:pagination="search.pagination.value"
        :is-loading="search.isListLoading.value"
        :filters="filters"
      />
    </div>
    <div
      class="assigned-works-view__selection"
      v-if="selectedWorks.length"
    >
      <p class="assigned-works-view__selection__title">
        Выбрано работ: {{ selectedWorks.length }}
      </p>
      <div class="assigned-works-view__selection__actions">
        <common-button
          design="secondary"
          @click="openChangeMentorModal(selectedWorks)"
        >
          Поменять куратора
        </common-button>
        <common-button
          design="danger"
          @click="openArchiveWorksModal(selectedWorks)"
          v-if="Core.Context.roleIs(['assistant'])"
        >
          Архивировать
        </common-button>
      </div>
    </div>
    <div class="assigned-works-view__results">
      <entity-table
        :data="search.results.value"
        :cols="cols"
        :actions="actions"
        :is-loading="search.isListLoading.value"
        @select="onSelect($event)"
        editable
      />
    </div>
    <div
      class="assigned-works-view__pagination"
      v-if="
        search.pagination.value.page &&
        search.resultsMeta.value.total &&
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
  <change-mentor-modal
    v-model:opened="changeMentorModalData.opened"
    v-model:mentorId="changeMentorModalData.mentorId"
    :assigned-works="changeMentorModalData.assignedWorks"
    @confirm="onMentorChanged()"
  />
  <sure-modal
    v-model:visible="archiveWorksModalData.opened"
    @confirm="onArchiveWorks()"
  >
    <template #title>
      {{
        archiveWorksModalData.assignedWorks.length > 1
          ? 'Архивировать работы'
          : 'Архивировать работу'
      }}
    </template>
    <template #text>
      <p>
        {{
          archiveWorksModalData.assignedWorks.length > 1
            ? `Вы уверены, что хотите архивировать выбранные работы (${archiveWorksModalData.assignedWorks.length})?`
            : `Вы уверены, что хотите архивировать работу "${archiveWorksModalData.assignedWorks[0]?.work?.name}"?`
        }}
      </p>
    </template>
  </sure-modal>
  <sure-modal
    v-model:visible="unarchiveWorksModalData.opened"
    @confirm="onUnarchiveWorks()"
  >
    <template #title>
      {{
        unarchiveWorksModalData.assignedWorks.length > 1
          ? 'Разархивировать работы'
          : 'Разархивировать работу'
      }}
    </template>
    <template #text>
      <p>
        {{
          unarchiveWorksModalData.assignedWorks.length > 1
            ? `Вы уверены, что хотите разархивировать выбранные работы (${unarchiveWorksModalData.assignedWorks.length})?`
            : `Вы уверены, что хотите разархивировать работу "${unarchiveWorksModalData.assignedWorks[0]?.work?.name}"?`
        }}
      </p>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import type { SearchFilter } from '@/components/search/filters/SearchFilter'
import ChangeMentorModal from './change-mentor-modal.vue'
import type { ColType } from '@/components/structures/entity-table/entity-table.vue'
import type { MenuItem } from '@/components/widgets/noo-more-widget.vue'
import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { User } from '@/core/data/entities/User'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { subjectFilter } from '@/core/filters/subject-filter'
import { solveStatusFilter } from '@/core/filters/solve-status-filter'
import { checkStatusFilter } from '@/core/filters/check-status-filter'
import { workTypeFilter } from '@/core/filters/work-type-filter'

interface Props {
  user: User
}

const props = defineProps<Props>()

const router = useRouter()

const search = useSearch(fetchAssignedWorks, {
  immediate: true,
  initialPagination: Core.Context.roleIs(['assistant'])
    ? {
        'filter[isArchivedByAssistants]': {
          type: 'boolean',
          value: false
        }
      }
    : undefined
})

const changeMentorModalData = ref<{
  opened: boolean
  mentorId: string | null
  assignedWorks: AssignedWork[]
}>({
  opened: false,
  mentorId: null,
  assignedWorks: []
})

const archiveWorksModalData = ref<{
  opened: boolean
  assignedWorks: AssignedWork[]
}>({
  opened: false,
  assignedWorks: []
})

const unarchiveWorksModalData = ref<{
  opened: boolean
  assignedWorks: AssignedWork[]
}>({
  opened: false,
  assignedWorks: []
})

async function fetchAssignedWorks(pagination?: Pagination) {
  try {
    return await Core.Services.AssignedWork.getAssignedWorksFromUser(
      props.user.id,
      pagination
    )
  } catch (error: any) {
    Core.Services.UI.openErrorModal(
      'Произошла ошибка при получении списка работ',
      error.message
    )
  }
}

const filters: SearchFilter[] = [
  workTypeFilter('work'),
  subjectFilter('work'),
  solveStatusFilter(),
  checkStatusFilter(),
  {
    name: 'Ученик сдвинул дедлайн',
    type: 'boolean',
    key: 'solveDeadlineShifted',
    booleanLabels: ['Нет', 'Да']
  },
  {
    name: 'Куратор сдвинул дедлайн',
    type: 'boolean',
    key: 'checkDeadlineShifted',
    booleanLabels: ['Нет', 'Да']
  },
  {
    name: 'Пересдача',
    type: 'boolean',
    key: 'isNewAttempt',
    booleanLabels: ['Нет', 'Да']
  },
  {
    name: Core.Context.roleIs(['assistant'])
      ? 'Архивированные'
      : 'Архивировано ассистентами',
    type: 'boolean',
    key: 'isArchivedByAssistants',
    booleanLabels: ['Нет', 'Да']
  }
]

const cols: ColType[] = [
  {
    title: '',
    value: (a: AssignedWork) => getUserAction(a).icon,
    type: 'icon'
  },
  {
    title: 'Название работы / Ученик / Куратор(ы)',
    type: 'text',
    joinType: 'br',
    value: (a: AssignedWork) => {
      return [
        a.work?.name || '-',
        `<small>${a.student?.name || '-'}</small>`,
        `<small>Кураторы: ${
          a.mentors?.map((m) => m.name).join(', ') || '-'
        }</small> ${
          a.isArchivedByMentors
            ? '<span style="color: var(--text-light)">[Архивировано]</span>'
            : ''
        }`
      ]
    }
  },
  {
    title: 'Дедлайн сдачи/сдано',
    type: 'date',
    joinType: 'br',
    value: (a: AssignedWork) => {
      return [a.solveDeadlineAt, a.solvedAt]
    }
  },
  {
    title: 'Дедлайн проверки/проверено',
    type: 'date',
    joinType: 'br',
    value: (a: AssignedWork) => {
      return [a.checkDeadlineAt, a.checkedAt]
    }
  },
  {
    title: 'Статус работы',
    type: 'text',
    joinType: 'br',
    value: (a: AssignedWork) => {
      return [solveStatus(a), checkStatus(a)]
    }
  },
  {
    title: 'Результат',
    type: 'text',
    joinType: '/',
    value: (a: AssignedWork) => {
      return [a.score === null ? '-' : a.score, a.maxScore]
    }
  }
]

function actions(assignedWork: AssignedWork): MenuItem[] {
  return [
    {
      title: 'Посмотреть',
      icon: 'eye',
      action: () => {
        router.push(`/assigned-works/${assignedWork.id}/read`)
      }
    },
    {
      title: 'Поменять куратора',
      icon: 'change-user',
      if:
        assignedWork.checkStatus === 'not-checked' ||
        assignedWork.checkStatus === 'in-progress',
      action: () => openChangeMentorModal([assignedWork])
    },
    {
      title: 'Архивировать',
      icon: 'delete',
      if:
        Core.Context.roleIs(['assistant']) &&
        !assignedWork.isArchivedByAssistants,
      action: () => openArchiveWorksModal([assignedWork])
    },
    {
      title: 'Разархивировать',
      icon: 'check-green',
      if:
        Core.Context.roleIs(['assistant']) &&
        assignedWork.isArchivedByAssistants,
      action: () => openUnarchiveWorksModal([assignedWork])
    }
  ]
}

function checkStatus(a: AssignedWork): string {
  switch (a.checkStatus) {
    case 'checked-in-deadline':
      return `<span style="color: var(--text-light)">Проверено в дедлайн</span>`
    case 'checked-after-deadline':
      return `<span style="color: var(--warning)">Проверено после дедлайна</span>`
    case 'checked-automatically':
      return `<span style="color: var(--success)">Проверено автоматически</span>`
    case 'not-checked':
      return `<span style="color: var(--text-light)">Не проверено</span>`
    case 'in-progress':
      return `<span style="color: var(--text-light)">В процессе</span>`
    default:
      return `<span style="color: var(--info)">-</span>`
  }
}

function solveStatus(a: AssignedWork): string {
  switch (a.solveStatus) {
    case 'made-in-deadline':
      return `<span style="color:var(--success)">Сдано в дедлайн</span>`
    case 'made-after-deadline':
      return `<span style="color:var(--danger)">Сдано после дедлайна</span>`
    case 'in-progress':
      return `<span style="color:var(--warning)">В процессе</span>`
    case 'not-started':
    default:
      return `<span style="color:var(--text-light)">-</span>`
  }
}

export type ActionType = 'read' | 'solve' | 'check'

type UserAction = {
  action: string
  link: `/assigned-works/${AssignedWork['id']}/${ActionType}`
  icon: string
}

/**
 * Get user action for assigned work based on its role
 */
function getUserAction(assignedWork: AssignedWork): UserAction {
  const role = Core.Context.User!.role

  if (role === 'admin' || role === 'teacher') {
    return {
      action: 'Просмотреть',
      link: `/assigned-works/${assignedWork.id}/read`,
      icon:
        assignedWork.checkStatus === 'not-checked'
          ? 'attention-yellow'
          : 'check-green'
    }
  }

  if (role === 'mentor') {
    if (
      assignedWork.solveStatus === 'not-started' ||
      assignedWork.solveStatus === 'in-progress'
    ) {
      return {
        action: 'Просмотреть',
        link: `/assigned-works/${assignedWork.id}/read`,
        icon: 'cross-red'
      }
    }

    if (
      assignedWork.checkStatus === 'not-checked' &&
      (assignedWork.solveStatus === 'made-in-deadline' ||
        assignedWork.solveStatus === 'made-after-deadline')
    ) {
      return {
        action: 'Ожидает проверки',
        link: `/assigned-works/${assignedWork.id}/check`,
        icon: 'attention-yellow'
      }
    }

    if (assignedWork.checkStatus === 'not-checked') {
      return {
        action: 'Проверить',
        link: `/assigned-works/${assignedWork.id}/check`,
        icon: 'attention-yellow'
      }
    }

    if (assignedWork.checkStatus === 'in-progress') {
      return {
        action: 'Продолжить проверку',
        link: `/assigned-works/${assignedWork.id}/check`,
        icon: 'attention-yellow'
      }
    }

    return {
      action: 'Просмотреть',
      link: `/assigned-works/${assignedWork.id}/read`,
      icon: 'check-green'
    }
  }

  // role is student
  if (assignedWork.solveStatus === 'not-started') {
    return {
      action: 'Начать выполнение',
      link: `/assigned-works/${assignedWork.id}/solve`,
      icon: 'cross-red'
    }
  }

  if (assignedWork.solveStatus === 'in-progress') {
    return {
      action: 'Продолжить выполнение',
      link: `/assigned-works/${assignedWork.id}/solve`,
      icon: 'cross-red'
    }
  }

  if (
    assignedWork.checkStatus === 'not-checked' &&
    (assignedWork.solveStatus === 'made-in-deadline' ||
      assignedWork.solveStatus === 'made-after-deadline')
  ) {
    return {
      action: 'Ожидает проверки',
      link: `/assigned-works/${assignedWork.id}/read`,
      icon: 'attention-yellow'
    }
  }

  return {
    action: 'Просмотреть',
    link: `/assigned-works/${assignedWork.id}/read`,
    icon: 'check-green'
  }
}

const selectedWorks = ref<AssignedWork[]>([])

function onSelect(assignedWorkIds: AssignedWork['id'][]) {
  selectedWorks.value = search.results.value.filter((work) =>
    assignedWorkIds.includes(work.id)
  )
}

function openChangeMentorModal(assignedWorks: AssignedWork[]) {
  changeMentorModalData.value = {
    opened: true,
    mentorId: null,
    assignedWorks
  }
}

function openArchiveWorksModal(assignedWorks: AssignedWork[]) {
  archiveWorksModalData.value = {
    opened: true,
    assignedWorks
  }
}

function openUnarchiveWorksModal(assignedWorks: AssignedWork[]) {
  unarchiveWorksModalData.value = {
    opened: true,
    assignedWorks
  }
}

function onMentorChanged() {
  selectedWorks.value = []
  search.trigger()
}

async function onArchiveWorks() {
  Core.Services.UI.setLoading(true)

  try {
    for (const work of archiveWorksModalData.value.assignedWorks) {
      await Core.Services.AssignedWork.archiveAssignedWork(work.id)
    }

    Core.Services.UI.openSuccessModal('Работы успешно архивированы')

    selectedWorks.value = []
    search.trigger()
  } catch (error: any) {
    Core.Services.UI.openErrorModal(
      'Произошла ошибка при архивировании работ',
      error.message
    )
  } finally {
    Core.Services.UI.setLoading(false)
  }
}

async function onUnarchiveWorks() {
  Core.Services.UI.setLoading(true)

  try {
    for (const work of unarchiveWorksModalData.value.assignedWorks) {
      await Core.Services.AssignedWork.unarchiveAssignedWork(work.id)
    }

    Core.Services.UI.openSuccessModal('Работы успешно разархивированы')

    selectedWorks.value = []
    search.trigger()
  } catch (error: any) {
    Core.Services.UI.openErrorModal(
      'Произошла ошибка при разархивировании работ',
      error.message
    )
  } finally {
    Core.Services.UI.setLoading(false)
  }
}
</script>

<style scoped lang="sass">
.assigned-works-view
  &__search
    padding: 1em

  &__filters
    padding: 1em

  &__selection
    padding: 1em
    display: flex
    justify-content: space-between

    &__text
      flex: 1px

    &__actions
      display: flex
      gap: 1em

  &__results
    margin-bottom: 1em

  &__pagination
    margin-top: 1em
</style>
