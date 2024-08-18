<template>
  <div class="poll-create-form"></div>
</template>

<script setup lang="ts">
import type { Poll } from '@/core/data/entities/Poll'
import { entityFactory } from '@/core/utils/entityFactory'
import { computed } from 'vue'

interface Props {
  mode: 'add' | 'upsert'
  modelValue: Poll | null
}

interface Emits {
  (event: 'update:modelValue', value: Poll): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const pollModel = computed({
  get: () => props.modelValue || entityFactory<Poll>('poll'),
  set: (value: Poll) => emit('update:modelValue', value)
})
</script>

<style scoped lang="sass"></style>
