import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProfileStore = defineStore('profile', () => {
  const charts = ref({
    firstWorkScore: 27,
    worksMadeCount: 12,
    madeBeforeDeadlineRate: 89,
    workScoreGraph: {
      labels: ['Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь', 'Январь', 'Февраль'],
      data: [
        {
          label: 'Химия',
          color: '#defba1',
          values: [15, 12, 17, 19, 18, 23]
        },
        {
          label: 'Биология',
          color: '#cdc9ff',
          values: [10, 12, 11, 13, 15, 17]
        }
      ]
    }
  })

  return { charts }
})
