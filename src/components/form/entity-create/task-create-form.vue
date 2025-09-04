<template>
  <div
    class="task-create-form"
    v-auto-animate
  >
    <div
      class="row"
      v-auto-animate
    >
      <div class="col-lg-4 col-12">
        <task-type-select
          label="Тип задания"
          v-model="model.type"
        />
      </div>
      <div class="col-lg-4 col-12">
        <form-input
          v-model="model.highestScore"
          label="Максимальный балл"
          type="number"
          :readonly="predefinedMaxScore(model.type) !== null"
          :validators="[
						(value: any) => value > 0 || 'Максимальный балл должен быть больше 0'
					]"
        />
      </div>
      <div
        class="col-lg-4 col-12"
        v-if="model.type === 'word'"
      >
        <task-checking-strategy-select
          v-model="model.checkingStrategy"
          label="Способ проверки"
        />
      </div>
    </div>
    <div class="row">
      <div
        class="col-lg-4 col-12"
        v-auto-animate
      >
        <div
          class="task-create-form__checkbox"
          v-if="model.type === 'word'"
        >
          <form-checkbox
            v-model="model.isAnswerVisibleBeforeCheck"
            label="Показывать ответ до проверки"
          />
        </div>
      </div>
      <div
        class="col-lg-4 col-12"
        v-auto-animate
      >
        <div
          class="task-create-form__checkbox"
          v-if="model.type === 'word'"
        >
          <form-checkbox
            v-model="model.isCheckOneByOneEnabled"
            label="Проверка сразу"
          />
        </div>
      </div>
    </div>
    <div class="form-group">
      <rich-text-area
        v-model="model.content"
        label="Задание"
      />
    </div>
    <div
      class="form-group"
      v-if="model.type === 'word'"
    >
      <tag-input
        label="Правильные ответы (нажмите Enter для добавления)"
        v-model="model.rightAnswer!"
        separator="|"
      />
    </div>
    <div class="form-group">
      <rich-text-area
        v-model="model.solveHint!"
        label="Подсказка для ученика"
      />
    </div>
    <div class="form-group">
      <rich-text-area
        v-model="model.checkHint!"
        label="Подсказка/пояснение для проверяющего (видна также ученику после проверки)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '@/core/data/entities/Task'
import { entityFactory } from '@/core/utils/entityFactory'
import { computed, watch } from 'vue'

interface Props {
  modelValue: Task | null
}

interface Emits {
  (event: 'update:modelValue', value: Task): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const model = computed<Task>({
  get: () => props.modelValue || entityFactory<Task>('task'),
  set: (value: Task) => emit('update:modelValue', value)
})

watch(
  () => model.value.type,
  () => {
    // change max score if it is predefined
    model.value.highestScore =
      predefinedMaxScore(model.value.type) ?? model.value.highestScore

    // reset right answer if it is not needed
    if (model.value.type !== 'word') {
      model.value.rightAnswer = null
    } else {
      model.value.rightAnswer = ''
    }

    // reset checking strategy if it is not needed
    if (model.value.type !== 'word') {
      model.value.checkingStrategy = null
    } else {
      model.value.checkingStrategy = 'type1'
    }
  }
)

function predefinedMaxScore(type: Task['type']): number | null {
  switch (type) {
    case 'word':
    case 'text':
      return null
    case 'essay':
      return 22
    case 'final-essay':
      return 5
    case 'dictation':
      return 50
  }
}
</script>

<style scoped lang="sass">
.task-create-form
  .form-group
    margin-top: 1em

  &__checkbox
    &:deep()
      .form-checkbox
        margin-top: 1em

        &__text
          line-height: 0.8em
          color: var(--text-light)
          font-size: 0.8em
          display: inline-block
</style>
