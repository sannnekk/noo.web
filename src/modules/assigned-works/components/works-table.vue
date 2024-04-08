<template>
  <div class="works-table">
    <div class="works-table__table">
      <entity-table
        :cols="cols"
        :data="works"
        :is-loading="loading"
        :tag-function="tagFunction"
        :editable="Core.Context.User?.role === 'mentor' && editable"
        @select="onSelect($event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { UserAction } from '../stores/assigned-works'
import { Core } from '@/core/Core'

interface Props {
  works: Partial<AssignedWork>[]
  loading?: boolean
  getUserActionFunction?: (a: AssignedWork) => UserAction
  editable?: boolean
}

interface Emits {
  (e: 'select', ids: string[]): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const cols = [
  {
    title: '',
    value: (a: AssignedWork) => props.getUserActionFunction!(a).icon,
    type: 'icon'
  },
  {
    title: 'Название работы / Ученик / Куратор(ы)',
    keys: ['work.name', 'student.name', 'mentors.each.name'],
    join: '<br>',
    type: 'text',
    style: ['redo', 'secondary', 'secondary']
  },
  {
    title: 'Дедлайн сдачи/проверки',
    keys: ['solveDeadlineAt', 'checkDeadlineAt'],
    type: 'date'
  },
  {
    title: 'Статус работы',
    keys: ['solveStatus', 'checkStatus'],
    type: 'tag',
    tagFunction
  },
  {
    title: 'Результат',
    keys: ['score', 'maxScore'],
    join: '/',
    style: 'centered',
    type: 'text'
  },
  {
    title: '',
    value: (a: AssignedWork) => props.getUserActionFunction!(a).action,
    type: 'link',
    linkTo: (a: AssignedWork) => props.getUserActionFunction!(a).link(a.id)
  }
]

function tagFunction(
  key: string,
  value: string | number
): { type: string; text: string } {
  if (value === 'made-in-deadline') {
    return {
      type: 'success',
      text: 'Сдано в дедлайн'
    }
  } else if (value === 'made-after-deadline') {
    return {
      type: 'danger',
      text: 'Сдано не в дедлайн'
    }
  } else if (value === 'checked-in-deadline') {
    return {
      type: 'info',
      text: 'Проверено в дедлайн'
    }
  } else if (value === 'checked-after-deadline') {
    return {
      type: 'warning',
      text: 'Проверено не в дедлайн'
    }
  } else if (value === 'checked-automatically') {
    return {
      type: 'info',
      text: 'Проверено автоматически'
    }
  } else if (value === 'not-made') {
    return {
      type: 'warning',
      text: 'Не сдано'
    }
  } else if (value === 'not-checked') {
    return {
      type: 'info',
      text: 'Не проверено'
    }
  }

  return {
    type: 'info',
    text: '-'
  }
}

function onSelect(ids: string[]) {
  emits('select', ids)
}
</script>
