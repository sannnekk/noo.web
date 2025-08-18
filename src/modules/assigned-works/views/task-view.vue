<template>
  <div
    class="task-view"
    v-if="assignedWorkStore.assignedWork && assignedWorkStore.task"
  >
    <div class="task-view__question">
      <rich-text-container :content="assignedWorkStore.task.content" />
      <div class="task-view__question__info">
        <p class="task-view__question__max-score">
          Максимальный балл: <b>{{ assignedWorkStore.task.highestScore }}</b>
        </p>
        <div
          class="task-view__question__add-to-favourites"
          v-if="
            Core.Context.roleIs(['student']) &&
            isCheckedAutomatically(assignedWorkStore.task.type) &&
            isWorkChecked(assignedWorkStore.assignedWork)
          "
        >
          <favourite-task-button :task-id="assignedWorkStore.task.id" />
        </div>
      </div>
    </div>
    <div class="task-view__answer">
      <answer-text-container
        v-if="assignedWorkStore.task.type === 'text'"
        v-model="assignedWorkStore.assignedWork"
        :task-id="assignedWorkStore.task.id"
        :readonly="assignedWorkStore.mode !== 'solve'"
        :commentable="assignedWorkStore.mode === 'check'"
      />
      <answer-word-container
        v-else-if="assignedWorkStore.task.type === 'word'"
        v-model="assignedWorkStore.assignedWork"
        :task-id="assignedWorkStore.task.id"
        :readonly="
          assignedWorkStore.mode !== 'solve' ||
          assignedWorkStore.taskIsSubmitted()
        "
      />
      <answer-essay-container
        v-else-if="assignedWorkStore.task.type === 'essay'"
        v-model="assignedWorkStore.assignedWork"
        :task-id="assignedWorkStore.task.id"
        :readonly="assignedWorkStore.mode !== 'solve'"
        :commentable="assignedWorkStore.mode === 'check'"
      />
      <answer-final-essay-container
        v-else-if="assignedWorkStore.task.type === 'final-essay'"
        v-model="assignedWorkStore.assignedWork"
        :task-id="assignedWorkStore.task.id"
        :readonly="assignedWorkStore.mode !== 'solve'"
        :commentable="assignedWorkStore.mode === 'check'"
      />
    </div>
    <br />
    <div
      class="task-view__comment"
      v-if="assignedWorkStore.mode !== 'solve'"
    >
      <comment-container
        v-model="assignedWorkStore.assignedWork"
        :task="assignedWorkStore.task"
        :readonly="assignedWorkStore.mode !== 'check'"
        :mode="assignedWorkStore.mode"
        :snippets="snippetStore.snippets"
      />
    </div>
    <div
      class="task-view__criteria"
      v-if="hasCriteria(assignedWorkStore.task.type)"
    >
      <criteria-container
        v-model="assignedWorkStore.assignedWork"
        :task="assignedWorkStore.task"
        :mode="assignedWorkStore.mode"
      />
    </div>
    <div class="taks-view__right-answer-and-score">
      <div class="row">
        <div class="col-md-6">
          <right-answer-container
            v-if="
              (isWorkChecked(assignedWorkStore.assignedWork) ||
                Core.Context.roleIs(['mentor']) ||
                (assignedWorkStore.mode === 'solve' &&
                  assignedWorkStore.taskIsSubmitted())) &&
              assignedWorkStore.task?.type === 'word' &&
              assignedWorkStore.task?.rightAnswer
            "
            :right-answer="assignedWorkStore.task.rightAnswer"
          />
        </div>
        <div class="col-md-6">
          <score-container
            v-if="
              assignedWorkStore.mode !== 'solve' ||
              assignedWorkStore.taskIsSubmitted()
            "
            v-model="assignedWorkStore.assignedWork"
            :task="assignedWorkStore.task"
            :readonly="
              assignedWorkStore.mode === 'read' ||
              assignedWorkStore.mode === 'solve'
            "
          />
        </div>
      </div>
    </div>
    <div class="task-view__hint">
      <div
        class="task-view__hint__container"
        v-if="
          assignedWorkStore.settings.showSolveHints &&
          assignedWorkStore.task.solveHint &&
          !isDeltaEmptyOrWhitespace(assignedWorkStore.task.solveHint)
        "
      >
        <h4 class="task-view__hint__title">Подсказка:</h4>
        <rich-text-container :content="assignedWorkStore.task.solveHint" />
      </div>
    </div>
    <div class="task-view__hint">
      <div
        class="task-view__hint__container"
        v-if="
          assignedWorkStore.settings.showCheckHints &&
          assignedWorkStore.task.checkHint &&
          (['check', 'read'].includes(assignedWorkStore.mode) ||
            assignedWorkStore.taskIsSubmitted()) &&
          !isDeltaEmptyOrWhitespace(assignedWorkStore.task.checkHint)
        "
      >
        <h4 class="task-view__hint__title">Пояснение:</h4>
        <rich-text-container :content="assignedWorkStore.task.checkHint" />
      </div>
    </div>
    <div class="task-view__action-buttons">
      <common-button
        alignment="left"
        design="inline"
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
        design="inline"
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
      <common-button
        alignment="right"
        design="inline"
        v-if="
          assignedWorkStore.task.isCheckOneByOneEnabled &&
          assignedWorkStore.mode === 'solve'
        "
        @click="assignedWorkStore.submitTask()"
      >
        {{
          assignedWorkStore.taskIsSubmitted()
            ? 'Перерешать'
            : 'Проверить задание'
        }}
      </common-button>
    </div>
  </div>
  <right-answer-modal
    v-model:visible="answerModalData.visible"
    :right-answer="answerModalData.answer"
  />
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import favouriteTaskButton from '../components/single-work/favourite-task-button.vue'
import criteriaContainer from '../components/single-work/criteria/criteria-container.vue'
import RightAnswerContainer from '../components/single-work/comment/right-answer-container.vue'
import AnswerTextContainer from '../components/single-work/answer/answer-text-container.vue'
import AnswerWordContainer from '../components/single-work/answer/answer-word-container.vue'
import AnswerEssayContainer from '../components/single-work/answer/answer-essay-container.vue'
import AnswerFinalEssayContainer from '../components/single-work/answer/answer-final-essay-container.vue'
import CommentContainer from '../components/single-work/comment/comment-container.vue'
import ScoreContainer from '../components/single-work/comment/score-container.vue'
import RightAnswerModal from '../components/single-work/answer/right-answer-modal.vue'
import {
  hasCriteria,
  isCheckedAutomatically,
  isWorkChecked
} from '../utils/task'
import { useAssignedWorkStore } from '../stores/assigned-work'
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

    &__info
      margin-top: 1em
      padding-top: 1em
      margin-bottom: 0
      border-top: 1px solid var(--border-color)
      font-weight: 500
      display: flex
      justify-content: space-between
      align-items: center

      @media (max-width: 996px)
        flex-direction: column

    &__max-score
      margin: 0
      font-weight: 500

    &__add-to-favourites
      margin-top: 0

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
      margin-bottom: 0.5em
      margin-left: 0.3em

  &__action-buttons
    margin-top: 2rem
    display: flex
    justify-content: space-between
    font-size: 0.9em

    > *
      display: inline-block
      width: auto

    @media (max-width: 992px)
      font-size: 0.8em
      flex-wrap: wrap
      gap: 1em
</style>
