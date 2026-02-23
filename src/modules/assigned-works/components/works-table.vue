<template>
  <div class="works-table">
    <div class="works-table__table">
      <entity-table
        :cols="cols"
        :data="works"
        :is-loading="loading"
        :editable="editable"
        @select="onSelect($event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import { Core } from '@/core/Core'
import type { ColType } from '@/components/structures/entity-table/entity-table.vue'
import { useDate } from '@/composables/useDate'

interface Props {
  works: AssignedWork[]
  loading?: boolean
  editable?: boolean
}

interface Emits {
  (e: 'select', ids: string[]): void
}

defineProps<Props>()
const emits = defineEmits<Emits>()

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
        a.work?.type === 'test'
          ? ''
          : `<small>Кураторы: ${
              a.mentors?.map((m) => m.name).join(', ') || '-'
            }</small>`
      ]
    }
  },
  {
    title: 'Дедлайн сдачи/сдано',
    type: 'text',
    joinType: 'br',
    value: (a: AssignedWork) => {
      return [
        a.solveDeadlineShifted
          ? `➡️📃 ${textifyDate(a.solveDeadlineAt)}`
          : textifyDate(a.solveDeadlineAt),
        textifyDate(a.solvedAt)
      ]
    }
  },
  {
    title: 'Дедлайн проверки/проверено',
    type: 'text',
    joinType: 'br',
    value: (a: AssignedWork) => {
      return [
        a.checkDeadlineShifted
          ? `➡️📃 ${textifyDate(a.checkDeadlineAt)}`
          : textifyDate(a.checkDeadlineAt),
        textifyDate(a.checkedAt)
      ]
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
  },
  {
    title: '',
    type: 'button',
    design: 'primary',
    alignment: 'center',
    value: (a: AssignedWork) => getUserAction(a).action,
    linkTo: (a: AssignedWork) => getUserAction(a).link
  }
]

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

function textifyDate(date: Date | null): string {
  return date ? useDate(date, { precision: 'day' }).toBeautiful() : '-'
}

function onSelect(ids: string[]) {
  emits('select', ids)
}
</script>
