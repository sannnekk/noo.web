<template>
  <div class="task-score-container">
    <select-input
      label="Балл:"
      :options="scoreOptions"
      v-model="model"
      :readonly="readonly || hasCriteria(task.type)"
    />
  </div>
</template>

<script setup lang="ts">
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { Comment } from '@/core/data/entities/Comment'
import type { Task } from '@/core/data/entities/Task'
import { entityFactory } from '@/core/utils/entityFactory'
import { hasCriteria } from '@/modules/assigned-works/utils/task'
import { computed, ref, watch } from 'vue'

interface Props {
  modelValue: AssignedWork
  task: Task
  readonly?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: AssignedWork): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const scoreOptions = computed(() => {
  const options = []

  for (let i = 0; i <= props.task.highestScore; i++) {
    options.push({
      label: i.toString(),
      value: i
    })
  }

  return options
})

const model = ref<number>(getScore())
watch(model, insertScore)
watch(
  () => props.modelValue,
  () => (model.value = getScore()),
  { deep: true }
)

function getScore() {
  const existingComment = props.modelValue.comments.find(
    (comment) => comment.taskId === props.task.id
  )

  return existingComment?.score || 0
}

function insertScore(value: number) {
  let comment = props.modelValue.comments.find(
    (comment) => comment.taskId === props.task.id
  )

  if (!comment) {
    comment = entityFactory<Comment>('comment')
    comment.taskId = props.task.id
    comment.score = value

    emits('update:modelValue', {
      ...props.modelValue,
      comments: [...props.modelValue.comments, comment]
    })
  } else {
    comment.score = value

    emits('update:modelValue', props.modelValue)
  }
}
</script>

<style scoped lang="sass">
.task-comment-container
  &__title
    font-weight: 500
</style>
