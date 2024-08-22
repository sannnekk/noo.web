<template>
  <div
    class="search-array-filter"
    v-if="filter.arrayOptions && model"
  >
    <check-list
      item-label-key="label"
      item-key="value"
      :items="filter.arrayOptions!"
      v-model="(model as any)"
      multiple
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
.search-array-filter
	display: block
	font-size: 0.8em
</style>
