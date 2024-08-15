<template>
  <div
    class="task-form"
    v-auto-animate
  >
    <div
      class="task-form__row"
      v-auto-animate
    >
      <div class="task-form__col-4 form-group">
        <select-input
          v-model="model.type"
          :options="taskTypeOptions"
          label="Тип задания"
        />
      </div>
      <div class="task-form__col-4 form-group">
        <form-input
          v-model="model.highestScore"
          label="Максимальный балл"
          type="number"
        />
      </div>
      <div
        class="task-form__col-4 form-group"
        v-if="model.type !== 'text'"
      >
        <select-input
          v-model="model.checkingStrategy"
          label="Способ проверки"
          :options="checkingStrategyOptions"
        />
        <div class="task-form__checkbox">
          <form-checkbox
            v-model="model.isAnswerVisibleBeforeCheck"
            label="Показывать ответ до проверки"
          />
        </div>
      </div>
    </div>
    <div class="task-form__row">
      <div class="task-form__col-12 form-group">
        <rich-text-area
          v-model="model.content"
          label="Задание"
        />
      </div>
    </div>
    <div
      class="task-form__row"
      v-if="['word'].includes(model.type)"
    >
      <div class="task-form__col-12 form-group">
        <tag-input
          label="Правильные ответы (нажмите Enter для добавления)"
          v-model="model.rightAnswer"
          separator="|"
        />
      </div>
    </div>
    <div class="task-form__row">
      <div class="task-form__col-12 form-group">
        <rich-text-area
          v-model="model.solveHint"
          label="Подсказка для ученика"
        />
      </div>
    </div>
    <div class="task-form__row">
      <div class="task-form__col-12 form-group">
        <rich-text-area
          v-model="model.checkHint"
          label="Подсказка/пояснение для проверяющего (видна также ученику после проверки)"
        />
      </div>
    </div>
    <div class="task-form__row">
      <div class="task-form__col-8 form-group"></div>
      <div class="task-form__col-4 form-group">
        <common-button
          design="danger"
          alignment="stretch"
          @click="$emit('remove-task', model.id)"
        >
          Удалить задание
        </common-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '@/core/data/entities/Task'
import { computed, reactive } from 'vue'

interface Props {
  modelValue: Task
  checkingStrategyOptions: { label: string; value: string }[]
}

interface Emits {
  (event: 'update:modelValue', value: Task): void
  (event: 'remove-task', taskId: string): void
}

type TaskType = Task['type']
type TaskTypeOption = {
  label: string
  value: TaskType
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})

const taskTypeOptions = reactive<TaskTypeOption[]>([
  {
    label: 'Ответ в одну строку',
    value: 'word'
  },
  {
    label: 'Открытый вопрос',
    value: 'text'
  }
])
</script>

<style scoped lang="sass">
.task-form
  margin-bottom: 2em

  .form-group
    padding: 0.5em

  &__col-1
    width: 8.3333333333%

  &__col-2
    width: 16.6666666667%

  &__col-3
    width: 25%

  &__col-4
    width: 33.3333333333%

  &__col-5
    width: 41.6666666667%

  &__col-6
    width: 50%

  &__col-7
    width: 58.3333333333%

  &__col-8
    width: 66.6666666667%

  &__col-9
    width: 75%

  &__col-10
    width: 83.3333333333%

  &__col-11
    width: 91.6666666667%

  &__col-12
    width: 100%

  &__row
    display: flex
    flex-wrap: wrap

  &__checkbox
    :deep()
      .form-checkbox
        margin-top: 1em

        &__text
          line-height: 0.8em
          color: var(--text-light)
          font-size: 0.8em
          display: inline-block
</style>
