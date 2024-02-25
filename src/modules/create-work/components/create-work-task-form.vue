<template>
  <div
    class="task-form"
    v-auto-animate
  >
    <div
      class="task-form__row"
      v-auto-animate
    >
      <div class="task-form__col-6 form-group">
        <select-input
          v-model="model.type"
          :options="taskTypeOptions"
          label="Тип задания"
        />
      </div>
      <div class="task-form__col-6 form-group">
        <form-input
          v-model="model.highestScore"
          label="Максимальный балл"
          type="number"
        />
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
      v-if="['one_choice', 'multiple_choice'].includes(model.type)"
    >
      <div class="task-form__col-12 form-group">
        <create-work-task-options
          v-model="model.options"
          :task="model"
        />
      </div>
    </div>
    <div
      class="task-form__row"
      v-if="['word'].includes(model.type)"
    >
      <div class="task-form__col-12 form-group">
        <form-input
          label="Правильный ответ"
          type="text"
          v-model="model.rightAnswer"
        />
      </div>
    </div>
    <div class="task-form__row">
      <div class="task-form__col-4 form-group"></div>
      <div
        class="task-form__col-4 form-group"
        v-if="mode == 'update'"
      ></div>
      <div class="task-form__col-4 form-group">
        <common-button
          design="secondary"
          alignment="stretch"
          @click="$emit('submit')"
        >
          Удалить задание
        </common-button>
      </div>
      <div
        class="task-form__col-4 form-group"
        v-if="mode == 'create'"
      >
        <common-button
          design="primary"
          alignment="stretch"
          @click="$emit('submit')"
        >
          Добавить задание
        </common-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import createWorkTaskOptions from './create-work-task-options.vue'
import type { Task } from '@/core/data/entities/Task'
import { computed, reactive } from 'vue'

interface Props {
  modelValue: Task
  mode: 'create' | 'update'
}

interface Emits {
  (event: 'update:modelValue', value: Task): void
  (event: 'submit'): void
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
    label: 'Несколько вариантов ответа',
    value: 'multiple_choice'
  },
  {
    label: 'Один вариант ответа',
    value: 'one_choice'
  },
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
</style>
@/core/data/entities/Task
