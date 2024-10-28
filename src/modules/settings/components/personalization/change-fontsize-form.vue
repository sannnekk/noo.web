<template>
  <div
    class="change-background-form"
    v-auto-animate
  >
    <select-input
      label="Размер шрифта"
      :options="options"
      v-model="fontSizeModel"
    />
    <common-button
      class="change-background-form__apply-button"
      @click="onSubmit()"
      v-if="fontSizeModel !== personalizationStore.settings.fontSize"
    >
      Применить
    </common-button>
    <p>
      Выбранный размер шрифта будет использоваться в работах и курсах
      <br />
      Предпросмотр:
    </p>
  </div>
  <div class="task-view__question">
    <rich-text-container
      :content="exampleTask.content"
      :font-size="fontSizeModel"
    />
    <p class="task-view__question__max-score">
      Максимальный балл: {{ exampleTask.highestScore }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePersonalizationStore } from '../../stores/personalization'
import type { UserSettings } from '@/core/data/entities/UserSettings'

const personalizationStore = usePersonalizationStore()

const options = [
  { value: 'small', label: 'Маленький' },
  { value: 'medium', label: 'Средний' },
  { value: 'large', label: 'Большой' }
]

const exampleTask: Task = {
  id: '01HRPNY2VXZE2CRTHAMX5RPNDB',
  createdAt: '2024-03-11T12:52:39.243Z',
  updatedAt: '2024-03-11T18:07:25.000Z',
  slug: 'd82b702b-0b93-4630-be45-46c7fef4e70e',
  order: 34,
  content: {
    ops: [
      {
        insert: '34.(6) Установление соответствия'
      },
      {
        insert: '\n'
      },
      {
        insert:
          'Установите соответствие между признаками и группами белков: к каждой позиции из левого столбца подберите соответствующую позицию из правого столбца. '
      },
      {
        insert: '\n\n'
      },
      {
        insert: 'ПРИЗНАК ГРУППА БЕЛКОВ '
      },
      {
        insert: '\n'
      },
      {
        insert: 'А) как правило, растворимы в воде '
      },
      {
        insert: '\n'
      },
      {
        insert: 'Б) обладают высокой механической прочностью '
      },
      {
        insert: '\n'
      },
      {
        insert: 'В) образуют ферменты '
      },
      {
        insert: '\n'
      },
      {
        insert: 'Г) выполняют структурную и сократительную функции '
      },
      {
        insert: '\n'
      },
      {
        insert: 'Д) представляют нити, волокна '
      },
      {
        insert: '\n'
      },
      {
        insert: 'Е) имеют вид компактных телец '
      },
      {
        insert: '\n'
      },
      {
        insert: '1) фибриллярные'
      },
      {
        insert: '\n'
      },
      {
        insert: '2) глобулярные'
      },
      {
        insert: '\n\n'
      }
    ]
  },
  highestScore: 2,
  type: 'word',
  workId: '01HRPNY2VKQXAGK0D9VFAK96YY',
  rightAnswer: '212112',
  solveHint: null,
  checkHint: null,
  checkingStrategy: 'type2',
  isAnswerVisibleBeforeCheck: false
}

const fontSizeModel = ref<UserSettings['fontSize']>(
  personalizationStore.settings.fontSize
)

function onSubmit() {
  personalizationStore.settings.fontSize = fontSizeModel.value
  personalizationStore.changeSettings()
}
</script>

<style scoped lang="sass">
.change-background-form
  p
    color: var(--text-light)

  &__apply-button
    margin-top: 1em

.task-view__question
  margin-bottom: 1rem
  padding-bottom: 1em
  padding: 1em
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
  border-radius: var(--border-radius)

  &__max-score
    margin-top: 1em
    padding-top: 1em
    margin-bottom: 0
    border-top: 1px solid var(--border-color)
    font-weight: 500
</style>
