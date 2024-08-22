<template>
  <div class="search-boolean-filter">
    <form-toggle
      :values="[
        {
          label: filter.booleanLabels![0],
          value: false
        },
        {
          label: filter.booleanLabels![1],
          value: true
        }
      ]"
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
.search-boolean-filter
	display: block
</style>
