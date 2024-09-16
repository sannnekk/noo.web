<template>
  <div
    class="criteria-container"
    v-auto-animate
  >
    <div class="criteria-container__header">
      <h4 @click="opened = !opened">
        <list-opener-arrow :opened="opened" />
        Критерии оценивания
      </h4>
    </div>
    <div
      class="criteria-container__body"
      v-if="opened && criteria.length"
    >
      <base-criteria
        :type="task.type"
        v-model:detailed-score="model"
        :comment-counts="commentCounts"
        :mode="mode"
        :criteria="criteria"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import baseCriteria from './base-criteria.vue'
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { Task } from '@/core/data/entities/Task'
import type { Comment } from '@/core/data/entities/Comment'
import type { AssignedWorkViewMode } from '../../../types/AssignedWorkViewMode'
import type { DetailedScore } from '@/core/data/entities/Comment'
import type { CriteriaItem } from '../../../types/CriteriaItem'
import { ref, watch } from 'vue'
import { entityFactory } from '@/core/utils/entityFactory'
import { scoreFromDetailedScore } from '../../../utils/task'

interface Props {
  modelValue: AssignedWork
  task: Task
  mode: AssignedWorkViewMode
}

interface Emits {
  (event: 'update:modelValue', value: AssignedWork): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const opened = ref(props.mode !== 'solve')

const criteria = ref<CriteriaItem[]>([])
setCriteria(props.task.type)

const commentCounts = ref<Record<string, number> | undefined>(
  getCommentCounts()
)
watch(
  [() => props.modelValue.answers, criteria],
  () => {
    commentCounts.value = getCommentCounts()
  },
  {
    deep: true
  }
)

const model = ref<DetailedScore>(getDetailedSCore())
watch(model, setDetailedScore, {
  deep: true,
  immediate: true
})

function getDetailedSCore() {
  const comment = props.modelValue.comments.find(
    (comment) => comment.taskId === props.task.id
  )

  return comment?.detailedScore || emptyDetailedScore(criteria.value)
}

function setDetailedScore(detailedScore: DetailedScore) {
  if (props.mode !== 'check') {
    return
  }

  const comment = props.modelValue.comments.find(
    (comment) => comment.taskId === props.task.id
  )

  if (comment) {
    comment.detailedScore = detailedScore
    comment.score = scoreFromDetailedScore(detailedScore)
    emits('update:modelValue', props.modelValue)
  } else {
    const newComment = entityFactory<Comment>('comment')

    newComment.taskId = props.task.id
    newComment.detailedScore = detailedScore
    newComment.score = scoreFromDetailedScore(detailedScore)

    emits('update:modelValue', {
      ...props.modelValue,
      comments: [...props.modelValue.comments, newComment]
    })
  }
}

function emptyDetailedScore(criteria: CriteriaItem[]) {
  return criteria.reduce((acc, item) => {
    acc[item.code] = item.maxScore
    return acc
  }, {} as Record<string, number>)
}

function getCommentCounts() {
  if (props.mode === 'solve') {
    return undefined
  }

  const answer = props.modelValue.answers.find(
    (comment) => comment.taskId === props.task.id
  )!

  const content = answer.content!

  const comments = content.ops
    .map((op) => op?.attributes?.comment)
    .filter(Boolean)

  const counts = criteria.value.reduce((acc, item) => {
    acc[item.code] = comments.filter(
      (comment) => comment.type === item.code
    ).length
    return acc
  }, {} as Record<string, number>)

  if (props.task.type === 'final-essay') {
    return counts
  }

  // apply this to detailed score
  for (const [key, value] of Object.entries(counts)) {
    if (model.value[key] !== undefined) {
      model.value[key] =
        model.value[key] - value > 0 ? model.value[key] - value : 0
    }
  }

  return counts
}

async function setCriteria(type: Task['type']) {
  const imported = await import(`./${type}-criteria.json`)
  criteria.value = imported.default

  if (!model.value || Object.entries(model.value).length === 0) {
    model.value = emptyDetailedScore(criteria.value)
  }
}
</script>

<style lang="sass" scoped>
.criteria-container
	&__header
		cursor: pointer

		&:hover
			color: var(--secondary)

	&__body
		margin-bottom: 1em
</style>
