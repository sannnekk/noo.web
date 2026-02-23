<template>
  <base-modal
    v-model:visible="visibilityModel"
    title="Редактирование ответа"
    type="warning"
    :actions="[
      { label: 'Сохранить', design: 'primary', handler: () => emits('submit') }
    ]"
  >
    <poll-question
      v-model:answer="answerModel"
      :question="question"
      :readonly="false"
    />
  </base-modal>
</template>

<script setup lang="ts">
import pollQuestion from './poll-question.vue'
import type { PollAnswer } from '@/core/data/entities/PollAnswer'
import type { PollQuestion } from '@/core/data/entities/PollQuestion'
import { computed } from 'vue'

interface Props {
  visible: boolean
  question: PollQuestion
  answer: PollAnswer
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'update:answer', value: PollAnswer): void
  (e: 'submit'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const answerModel = computed({
  get: () => props.answer,
  set: (value: PollAnswer) => emits('update:answer', value)
})

const visibilityModel = computed({
  get: () => props.visible,
  set: (value: boolean) => emits('update:visible', value)
})
</script>

<style scoped lang="sass"></style>
