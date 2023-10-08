<template>
  <div class="works-table">
    <entity-table
      :cols="cols"
      :data="data"
      :tag-function="tagFunction"
    />
  </div>
</template>

<script setup lang="ts">
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
    join: '<br>',
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

const data = [
  {
    icon: 'check-green',
    name: '01.03 ДЗ 2 часть, Биохимия клетки',
    solveDeadline: new Date('2023-03-03'),
    checkDeadline: new Date('2023-03-05'),
    solveStatus: 'made-in-deadline',
    checkStatus: 'checked-in-deadline',
    score: 13,
    maxScore: 20,
    action: 'Просмотреть'
  },
  {
    icon: 'check-red',
    name: '05.03 ДЗ 2 часть, 2 прохождение: подкласс Круглоротые, класс Рыбы, Земноводные и Пресмыкающиеся',
    solveDeadline: new Date('2023-03-07'),
    checkDeadline: new Date('2023-03-09'),
    solveStatus: 'made-after-deadline',
    checkStatus: 'not-checked',
    score: '-',
    maxScore: '-',
    action: 'Просмотреть'
  },
  {
    icon: 'attention-yellow',
    name: '07.03 Тест по циклам растений, 200 вопросов',
    solveDeadline: new Date('2023-03-09'),
    checkDeadline: new Date('2023-03-11'),
    solveStatus: 'not-made',
    checkStatus: 'not-checked',
    score: '-',
    maxScore: '-',
    action: 'Перейти'
  },
  {
    icon: 'cross-red',
    name: '07.03 Тест по циклам растений, 200 вопросов',
    solveDeadline: new Date('2023-03-09'),
    checkDeadline: new Date('2023-03-11'),
    solveStatus: 'not-made',
    checkStatus: 'not-checked',
    score: '-',
    maxScore: '-',
    action: 'Перейти'
  },
  {
    icon: 'check',
    name: '07.03 Тест по циклам растений, 200 вопросов',
    solveDeadline: new Date('2023-03-09'),
    checkDeadline: new Date('2023-03-11'),
    solveStatus: 'not-made',
    checkStatus: 'not-checked',
    score: '-',
    maxScore: '-',
    action: 'Перейти'
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
