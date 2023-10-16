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
import type { Work } from '@/types/entities/Work'

interface Props {
  works: Partial<Work>[]
}

defineProps<Props>()

const cols = [
  {
    title: '',
    keys: ['icon'],
    type: 'icon'
  },
  {
    title: 'Название работы',
    keys: ['name'],
    type: 'text',
    style: 'bold'
  },
  {
    title: 'Дедлайн сдачи/проверки',
    keys: ['solveDeadline', 'checkDeadline'],
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
    keys: ['action'],
    type: 'link',
    linkTo: '/works/1'
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
