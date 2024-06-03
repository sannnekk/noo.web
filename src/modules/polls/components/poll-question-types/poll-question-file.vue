<template>
  <div class="poll-question-file">
    <p class="poll-question-file__hint">
      <span v-if="question.allowedFileTypes">
        Разрешены файлы типа:
        <b>
          {{
            question.allowedFileTypes
              .map((type) => type.split('/')[1])
              .join(', ')
          }}
        </b>
      </span>
      <span>
        Максимальное количество файлов: <b>{{ question.maxFileCount || 1 }}</b>
      </span>
      <span>
        Максимальный размер файла: <b>{{ question.maxFileSize || 1 }} МБ</b>
      </span>
    </p>
    <file-input
      v-model="model.files"
      label="Выберите файлы"
      :allowed-mime-types="question.allowedFileTypes"
      :max-file-size="(question.maxFileSize || 1) * 1024 * 1024"
      :max-count="question.maxFileCount || 1"
      :readonly="readonly"
    />
  </div>
</template>

<script setup lang="ts">
import type { PollAnswer } from '@/core/data/entities/PollAnswer'
import type { PollQuestion } from '@/core/data/entities/PollQuestion'
import { computed } from 'vue'

interface Props {
  question: PollQuestion
  answer: PollAnswer
  readonly?: boolean
}

interface Emits {
  (e: 'update:answer', value: PollAnswer): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const model = computed({
  get: () => props.answer,
  set: (value) => emit('update:answer', value)
})
</script>

<style scoped lang="sass">
.poll-question-file
  &__hint
    span
      color: var(--text-light)
      display: block
      font-size: 0.8em
</style>
