<template>
  <div class="task-options">
    <label>Варианты ответов</label>
    <div class="task-options__list">
      <draggable-list
        v-model="model"
        item-key="id"
      >
        <template v-slot="{ item }">
          <div class="task-options__list__item">
            <p class="task-options__list__item__name">
              {{ item.name }}
            </p>
            <span class="task-options__list__item__is-correct">
              <form-checkbox
                v-model="item.isCorrect"
                label="Правильный вариант"
              />
            </span>
            <span class="task-options__list__item__actions">
              <!-- TODO: trash icon -->
            </span>
          </div>
        </template>
      </draggable-list>
    </div>
    <div class="task-options__add">
      <div class="taks-options__add__input">
        <form-input
          v-model="newTaskOption.name"
          label="Новый вариант ответа"
        />
      </div>
      <div class="task-options__add__is-correct">
        <form-checkbox
          v-model="newTaskOption.isCorrect"
          label="Правильный вариант"
        />
      </div>
      <div class="task-options__add__add-button">
        <common-button
          @click="onAddTaskOption"
          design="secondary"
          alignment="right"
        >
          Добавить
        </common-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskOption } from '@/types/entities/TaskOption'
import { computed, ref } from 'vue'
import { v4 as uuid } from 'uuid'
import type { Task } from '@/types/entities/Task'

interface Props {
  task: Task
  modelValue?: TaskOption[]
}

interface Emits {
  (event: 'update:modelValue', value: TaskOption[]): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue || [],
  set: (value) => emits('update:modelValue', value)
})

function emptyTaskOption(): TaskOption {
  return {
    id: uuid(),
    name: '',
    isCorrect: false,
    taskId: props.task.id
  }
}

const newTaskOption = ref<TaskOption>(emptyTaskOption())

function onAddTaskOption() {
  model.value = [...model.value, newTaskOption.value]
  newTaskOption.value = emptyTaskOption()
}

function onRemoveTaskOption(taskOption: TaskOption) {
  model.value = model.value.filter((item) => item.id !== taskOption.id)
}
</script>

<style scoped lang="sass">
.task-options
  &__list
    counter-reset: list

    &__item
      display: flex
      align-items: center
      justify-content: space-between
      border: 1px solid var(--border-color)
      border-radius: var(--border-radius)
      padding: 0 1em
      margin-bottom: 0.4em

      &__name
        flex: 1
        margin-right: 10px
        color: var(--text-light)

        &::before
          counter-increment: list
          content: counter(list)
          margin-right: 0.9em

  &__add
    display: flex
    align-items: flex-end
    justify-content: space-between

    &__input
      flex: 1
      margin-right: 10px

    &__is-correct
      flex: 0 0 200px
      margin-right: 10px
      margin-bottom: 0.3em

    &__add-button
      flex: 0 0 100px
      font-size: 0.8em
</style>
