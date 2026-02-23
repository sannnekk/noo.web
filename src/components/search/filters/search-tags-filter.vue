<template>
  <div class="search-tags-filter">
    <tag-input
      label="Введите тег"
      v-model="model"
    />
  </div>
</template>

<script setup lang="ts">
import type { FilterType } from '@/core/data/Pagination'
import type { SearchFilter } from './SearchFilter'
import { computed } from 'vue'

interface Props {
  filter: SearchFilter
  modelValue: FilterType['value']
}

interface Emits {
  (event: 'update:modelValue', value: FilterType['value']): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})
</script>

<style scoped lang="sass">
.search-tags-filter
	display: block
</style>
