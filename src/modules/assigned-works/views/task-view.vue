<template>
  <div
    class="task-view"
    v-if="assignedWorkStore.assignedWork && assignedWorkStore.task"
  >
    <div class="task-view__question">
      <rich-text-container :content="assignedWorkStore.task.content" />
      <p class="task-view__question__max-score">
        Максимальный балл: {{ assignedWorkStore.task.highestScore }}
      </p>
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
        :commentable="assignedWorkStore.fieldVisibility.checkBox === 'visible'"
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
    <br />
    <div class="taks-view__right-answer">
      <div class="row">
        <div class="col-md-6">
          <form-input
            v-if="
              ['visible', 'readonly'].includes(
                assignedWorkStore.fieldVisibility.scoreBox
              ) && assignedWorkStore.task?.type === 'word'
            "
            readonly
            :label="
              assignedWorkStore.task?.rightAnswer.split('|').length > 1
                ? 'Правильные ответы'
                : 'Правильный ответ'
            "
            :model-value="
              assignedWorkStore.task?.rightAnswer.split('|').join(', ') || ''
            "
            type="text"
          />
        </div>
        <div class="col-md-6">
          <task-score-container
            v-if="
              ['visible', 'readonly'].includes(
                assignedWorkStore.fieldVisibility.scoreBox
              )
            "
            v-model="assignedWorkStore.assignedWork"
            :task="assignedWorkStore.task"
            :readonly="
              assignedWorkStore.fieldVisibility.scoreBox === 'readonly'
            "
          />
        </div>
      </div>
    </div>
    <div
      class="task-view__hint"
      v-if="assignedWorkStore.task.solveHint"
    >
      <h4 class="task-view__hint__title">Подсказка:</h4>
      <rich-text-container :content="assignedWorkStore.task.solveHint" />
    </div>
    <div
      class="task-view__hint"
      v-if="
        assignedWorkStore.task.checkHint &&
        ['check', 'read'].includes(assignedWorkStore.mode)
      "
    >
      <h4 class="task-view__hint__title">Пояснение:</h4>
      <rich-text-container :content="assignedWorkStore.task.checkHint" />
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
        :mode="assignedWorkStore.mode"
      />
    </div>
    <div
      class="task-view__action-buttons"
      v-if="(assignedWorkStore.assignedWork?.work?.tasks.length || 0) > 1"
    >
      <common-button
        alignment="left"
        design="secondary"
        v-if="assignedWorkStore.previousTaskLink"
        :to="assignedWorkStore.previousTaskLink"
      >
        Предыдущий вопрос
      </common-button>
      <common-button
        alignment="right"
        v-if="assignedWorkStore.nextTaskLink"
        :to="assignedWorkStore.nextTaskLink"
      >
        Следующий вопрос
      </common-button>
    </div>
  </div>
  <div
    class="task-view__not-chosen"
    v-else
  >
    <p class="task-view__task-not-found">Выберите задание</p>
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
  &__question
    margin-bottom: 1rem
    padding-bottom: 1em
    padding: 1em
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5)
    border-radius: var(--border-radius)

    &__max-score
      margin-top: 1em
      padding-top: 1em
      margin-bottom: 0
      border-top: 1px solid var(--border-color)
      font-weight: 500

  &__hint
    margin-top: 1rem

    &__title
      font-weight: 700
      font-size: 1.5em
      margin-bottom: 0.5em
      margin-left: 0.3em

  &__action-buttons
    margin-top: 2rem
    display: flex

    @media (max-width: 768px)
      font-size: 0.8rem
</style>
