<template>
  <div class="right-answer-container">
    <form-input
      readonly
      :label="label"
      :model-value="value"
      type="text"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  rightAnswer: string
}

const props = defineProps<Props>()

const label = computed(() =>
  props.rightAnswer.split('|').length > 1
    ? 'Правильные ответы'
    : 'Правильный ответ'
)

const value = computed(() => props.rightAnswer.split('|').join(', ') || '')
</script>
