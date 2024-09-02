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
    <div class="task-view__answer">
      <task-answer-text-container
        v-if="assignedWorkStore.task.type === 'text'"
        v-model="assignedWorkStore.assignedWork"
        :task="assignedWorkStore.task"
        :readonly="assignedWorkStore.mode !== 'solve'"
        :commentable="assignedWorkStore.mode === 'check'"
      />
      <task-answer-word-container
        v-else-if="assignedWorkStore.task.type === 'word'"
        v-model="assignedWorkStore.assignedWork"
        :task="assignedWorkStore.task"
        :readonly="assignedWorkStore.mode !== 'solve'"
      />
    </div>
    <br />
    <div class="taks-view__right-answer">
      <div class="row">
        <div class="col-md-6">
          <form-input
            v-if="
              assignedWorkStore.mode === 'read' &&
              assignedWorkStore.task?.type === 'word'
            "
            readonly
            :label="
              assignedWorkStore.task?.rightAnswer!.split('|').length > 1
                ? 'Правильные ответы'
                : 'Правильный ответ'
            "
            :model-value="
              assignedWorkStore.task?.rightAnswer!.split('|').join(', ') || ''
            "
            type="text"
          />
        </div>
        <div class="col-md-6">
          <task-score-container
            v-if="assignedWorkStore.mode !== 'solve'"
            v-model="assignedWorkStore.assignedWork"
            :task="assignedWorkStore.task"
            :readonly="assignedWorkStore.mode === 'read'"
          />
        </div>
      </div>
    </div>
    <div
      class="task-view__hint"
      v-if="
        assignedWorkStore.task.solveHint &&
        !isDeltaEmptyOrWhitespace(assignedWorkStore.task.solveHint)
      "
    >
      <h4 class="task-view__hint__title">Подсказка:</h4>
      <rich-text-container :content="assignedWorkStore.task.solveHint" />
    </div>
    <div
      class="task-view__hint"
      v-if="
        assignedWorkStore.task.checkHint &&
        ['check', 'read'].includes(assignedWorkStore.mode) &&
        !isDeltaEmptyOrWhitespace(assignedWorkStore.task.checkHint)
      "
    >
      <h4 class="task-view__hint__title">Пояснение:</h4>
      <rich-text-container :content="assignedWorkStore.task.checkHint" />
    </div>
    <div
      class="task-view__comment"
      v-if="assignedWorkStore.mode !== 'solve'"
    >
      <task-comment-container
        v-model="assignedWorkStore.assignedWork"
        :task="assignedWorkStore.task"
        :readonly="assignedWorkStore.mode !== 'check'"
        :mode="assignedWorkStore.mode"
        :snippets="snippetStore.snippets"
      />
    </div>
    <div class="task-view__action-buttons">
      <common-button
        alignment="left"
        design="warning"
        v-if="
          assignedWorkStore.task.isAnswerVisibleBeforeCheck &&
          assignedWorkStore.task.type === 'word' &&
          assignedWorkStore.mode === 'solve'
        "
        @click="openAnswerModal()"
      >
        Посмотреть ответ
      </common-button>
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
  <answer-modal
    v-model:visible="answerModalData.visible"
    :right-answer="answerModalData.answer"
  />
</template>

<script setup lang="ts">
import AnswerModal from '../components/single-work/answer-modal.vue'
import { useAssignedWorkStore } from '../stores/assigned-work'
import taskAnswerTextContainer from '../components/single-work/task-answer-text-container.vue'
import taskAnswerWordContainer from '../components/single-work/task-answer-word-container.vue'
import taskCommentContainer from '../components/single-work/task-comment-container.vue'
import taskScoreContainer from '../components/single-work/task-score-container.vue'
import { isDeltaEmptyOrWhitespace } from '@/core/utils/deltaHelpers'
import { ref } from 'vue'
import { useSnippetStore } from '../stores/snippet'

const assignedWorkStore = useAssignedWorkStore()
const snippetStore = useSnippetStore()

const answerModalData = ref({
  visible: false,
  answer: ''
})

function openAnswerModal() {
  answerModalData.value.answer = assignedWorkStore.task!.rightAnswer!
  answerModalData.value.visible = true
}
</script>

<style scoped lang="sass">
.task-view
  &__question
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

  &__answer
    margin-top: 1em
    padding: 1em
    padding-top: 0.2em
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
    border-radius: var(--border-radius)

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
    justify-content: space-between
    font-size: 0.9em

    @media (max-width: 768px)
      font-size: 0.8em
</style>
