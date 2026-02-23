<template>
  <accordion-list
    :items="criteria"
    v-if="criteria"
  >
    <template #head="{ item, openAction }">
      <div class="criteria__head">
        <p
          class="criteria__head__title"
          v-html="item.title"
          @click="openAction()"
        ></p>
        <div
          class="criteria__head__score-input"
          v-if="mode === 'check'"
        >
          <select-input
            label=""
            :options="scoreOptions(item.maxScore)"
            v-model="detailedScoreModel[item.code]"
          />
          <span class="criteria__head__comment-count">
            {{ commentCounts![item.code] }} комментариев
          </span>
        </div>
        <div
          class="criteria__head__score"
          v-else-if="mode === 'read'"
        >
          <span> {{ detailedScore[item.code] || 0 }}/{{ item.maxScore }} </span>
          <span class="criteria__head__comment-count">
            {{ commentCounts![item.code] }} комментариев
          </span>
        </div>
        <div
          class="criteria__head__max-score"
          v-else
        >
          <span> Макс. {{ scoreText(item.maxScore) }} </span>
        </div>
      </div>
    </template>
    <template #body="{ item }">
      <p
        class="criteria__description"
        v-html="item.description"
      ></p>
    </template>
  </accordion-list>
</template>

<script setup lang="ts">
import type { Task } from '@/core/data/entities/Task'
import type { AssignedWorkViewMode } from '@/modules/assigned-works/types/AssignedWorkViewMode'
import type { CriteriaItem } from '@/modules/assigned-works/types/CriteriaItem'
import { computed, ref } from 'vue'

interface Props {
  type: Task['type']
  detailedScore: Record<string, number>
  commentCounts?: Record<string, number>
  mode: AssignedWorkViewMode
}

interface Emits {
  (event: 'update:detailedScore', value: Record<string, number>): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const detailedScoreModel = computed({
  get: () => props.detailedScore,
  set: (value: Record<string, number>) => emits('update:detailedScore', value)
})

const criteria = ref<CriteriaItem[]>([])
getCriteria(props.type)

function scoreText(score: number) {
  if (score === 1) {
    return score + ' балл'
  } else if (score > 1 && score < 5) {
    return score + ' балла'
  } else if (score < 21) {
    return score + ' баллов'
  } else if (score % 10 === 1) {
    return score + ' балл'
  } else if (score % 10 > 1 && score % 10 < 5) {
    return score + ' балла'
  } else {
    return score + ' баллов'
  }
}

function scoreOptions(maxScore: number) {
  const options = [] as { label: string; value: number }[]

  for (let i = 0; i <= maxScore; i++) {
    options.push({
      label: scoreText(i),
      value: i
    })
  }

  return options
}

function getCriteria(type: Task['type']) {
  import(`./${type}-criteria.json`).then((module) => {
    criteria.value = module.default
  })
}
</script>

<style lang="sass" scoped>
.criteria
	&__head
		display: flex
		align-items: center

		&__title
			flex: 1
			margin: 0
			padding-right: 1em

		&__comment-count
			color: var(--text-light)
			font-size: 0.8em
			text-align: right
			display: block

	&__description
		color: var(--text-light)
</style>
