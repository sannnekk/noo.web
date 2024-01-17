<template>
  <div
    class="task-view"
    v-if="worksStore.assignedWork && worksStore.task"
  >
    <h2 class="task-view__title">{{ worksStore.assignedWork?.work?.name }}</h2>
    <div class="task-view__question">
      <rich-text-container :content="worksStore.task?.content" />
    </div>
    <div
      class="task-view__answer"
      v-if="
        ['visible', 'readonly'].includes(worksStore.fieldVisibility.solveBox)
      "
    >
      <task-answer-text-container
        v-if="worksStore.task.type === 'text'"
        v-model="worksStore.assignedWork"
        :task="worksStore.task"
        :readonly="worksStore.fieldVisibility.solveBox === 'readonly'"
      />
      <task-answer-word-container
        v-if="worksStore.task.type === 'word'"
        v-model="worksStore.assignedWork"
        :task="worksStore.task"
        :readonly="worksStore.fieldVisibility.solveBox === 'readonly'"
      />
      <task-answer-options-container
        v-else-if="
          worksStore.task.type === 'multiple_choice' ||
          worksStore.task.type === 'one_choice'
        "
        v-model="worksStore.assignedWork"
        :task="worksStore.task"
        :readonly="worksStore.fieldVisibility.solveBox === 'readonly'"
        :multiple="worksStore.task.type === 'multiple_choice'"
      />
    </div>
    <div
      class="taks-view__score"
      v-if="
        ['visible', 'readonly'].includes(worksStore.fieldVisibility.scoreBox)
      "
    >
      <task-score-container
        v-model="worksStore.assignedWork"
        :task="worksStore.task"
        :readonly="worksStore.fieldVisibility.scoreBox === 'readonly'"
      />
    </div>
    <div
      class="task-view__comment"
      v-if="
        ['visible', 'readonly'].includes(worksStore.fieldVisibility.checkBox)
      "
    >
      <task-comment-container
        v-model="worksStore.assignedWork"
        :task="worksStore.task"
        :readonly="worksStore.fieldVisibility.checkBox === 'readonly'"
      />
    </div>
    <br />
    <common-button
      alignment="right"
      v-if="worksStore.nextTaskLink"
      :to="worksStore.nextTaskLink"
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
import { useAssignedWorksStore } from '../stores/works'
import taskAnswerTextContainer from '../components/task-answer-text-container.vue'
import taskAnswerWordContainer from '../components/task-answer-word-container.vue'
import taskAnswerOptionsContainer from '../components/task-answer-options-container.vue'
import taskCommentContainer from '../components/task-comment-container.vue'
import taskScoreContainer from '../components/task-score-container.vue'

const worksStore = useAssignedWorksStore()
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
