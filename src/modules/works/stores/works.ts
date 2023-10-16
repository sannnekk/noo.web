import type { Work } from '@/types/entities/Work'
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useWorksStore = defineStore('works', () => {
  const works = reactive<(Work & any)[]>([
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
      icon: 'check-green',
      name: '07.03 Тест по циклам растений, 200 вопросов',
      solveDeadline: new Date('2023-03-09'),
      checkDeadline: new Date('2023-03-11'),
      solveStatus: 'not-made',
      checkStatus: 'not-checked',
      score: '-',
      maxScore: '-',
      action: 'Перейти'
    }
  ])

  const search = ref('')

  return { works, search }
})
