<template>
  <div
    class="task-view"
    v-if="assignedWorkStore.assignedWork && assignedWorkStore.task"
  >
    <h2 class="task-view__title">
      {{ assignedWorkStore.assignedWork?.work?.name }}
    </h2>
    <div class="task-view__question">
      <rich-text-container :content="assignedWorkStore.task?.content" />
    </div>
    <div
      class="task-view__answer"
      v-if="
        ['visible', 'readonly'].includes(
          assignedWorkStore.fieldVisibility.solveBox
        )
      "
    >
      <task-answer-text-container
        v-if="assignedWorkStore.task.type === 'text'"
        v-model="assignedWorkStore.assignedWork"
        :task="assignedWorkStore.task"
        :readonly="assignedWorkStore.fieldVisibility.solveBox === 'readonly'"
      />
      <task-answer-word-container
        v-if="assignedWorkStore.task.type === 'word'"
        v-model="assignedWorkStore.assignedWork"
        :task="assignedWorkStore.task"
        :readonly="assignedWorkStore.fieldVisibility.solveBox === 'readonly'"
      />
      <task-answer-options-container
        v-else-if="
          assignedWorkStore.task.type === 'multiple_choice' ||
          assignedWorkStore.task.type === 'one_choice'
        "
        v-model="assignedWorkStore.assignedWork"
        :task="assignedWorkStore.task"
        :readonly="assignedWorkStore.fieldVisibility.solveBox === 'readonly'"
        :multiple="assignedWorkStore.task.type === 'multiple_choice'"
      />
    </div>
    <div
      class="taks-view__score"
      v-if="
        ['visible', 'readonly'].includes(
          assignedWorkStore.fieldVisibility.scoreBox
        )
      "
    >
      <task-score-container
        v-model="assignedWorkStore.assignedWork"
        :task="assignedWorkStore.task"
        :readonly="assignedWorkStore.fieldVisibility.scoreBox === 'readonly'"
      />
    </div>
    <div
      class="task-view__comment"
      v-if="
        ['visible', 'readonly'].includes(
          assignedWorkStore.fieldVisibility.checkBox
        )
      "
    >
      <task-comment-container
        v-model="assignedWorkStore.assignedWork"
        :task="assignedWorkStore.task"
        :readonly="assignedWorkStore.fieldVisibility.checkBox === 'readonly'"
      />
    </div>
    <br />
    <common-button
      alignment="right"
      v-if="assignedWorkStore.nextTaskLink"
      :to="assignedWorkStore.nextTaskLink"
    >
      Следующий вопрос
    </common-button>
  </div>
  <div
    class="task-view__not-chosen"
    v-else
  >
    <h2 class="task-view__title">Выберите задание</h2>
  </div>
</template>

<script setup lang="ts">
import { useAssignedWorkStore } from '../stores/assigned-work'
import taskAnswerTextContainer from '../components/task-answer-text-container.vue'
import taskAnswerWordContainer from '../components/task-answer-word-container.vue'
import taskAnswerOptionsContainer from '../components/task-answer-options-container.vue'
import taskCommentContainer from '../components/task-comment-container.vue'
import taskScoreContainer from '../components/task-score-container.vue'

const assignedWorkStore = useAssignedWorkStore()
</script>

<style scoped lang="sass">
.task-view
  &__title
    font-weight: 500

  &__subtitle
    font-weight: 500

  &__question
    margin-bottom: 1rem
</style>
../stores/assigned-works
