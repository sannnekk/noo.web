<template>
  <div class="works-table">
    <entity-table
      :cols="cols"
      :data="works"
      :tag-function="tagFunction"
    />
  </div>
</template>

<script setup lang="ts">
import type { AssignedWork } from '@/types/entities/AssignedWork'
import type { UserAction } from '../stores/works'

interface Props {
  works: Partial<AssignedWork>[]
  getUserActionFunction: (a: AssignedWork) => UserAction
}

const props = defineProps<Props>()

const cols = [
  {
    title: '',
    value: (a: AssignedWork) => props.getUserActionFunction(a).icon,
    type: 'icon'
  },
  {
    title: 'Название работы',
    keys: ['work.name'],
    type: 'text',
    style: 'bold'
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
    value: (a: AssignedWork) => props.getUserActionFunction(a).action,
    type: 'link',
    linkTo: (a: AssignedWork) => props.getUserActionFunction(a).link(a.id)
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
      text: 'Проверено'
    }
  } else if (value === 'checked-after-deadline') {
    return {
      type: 'warning',
      text: 'Проверено не в дедлайн'
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
</script>
