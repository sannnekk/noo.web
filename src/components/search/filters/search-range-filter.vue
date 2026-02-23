<template>
  <div class="search-range-filter">
    <div class="search-range-filter__input">
      <form-input
        label="От"
        :type="filter.rangeType!"
        v-model="model[0]"
      />
    </div>
    <div class="search-range-filter__input">
      <form-input
        label="До"
        :type="filter.rangeType!"
        v-model="model[1]"
      />
    </div>
    <div class="search-range-filter__action">
      <common-button
        design="inline"
        @click="reset()"
      >
        Сбросить
      </common-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FilterType } from '@/core/data/Pagination'
import type { SearchFilter } from './SearchFilter'
import { ref, watch } from 'vue'

interface Props {
  filter: SearchFilter
  modelValue: FilterType['value']
}

interface Emits {
  (event: 'update:modelValue', value: FilterType['value']): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = ref(props.modelValue)

watch(
  model,
  () => {
    emits('update:modelValue', model.value)
  },
  { deep: true }
)

function reset() {
  const tenYearsAgo = new Date()
  tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10)
  const inTenYears = new Date()
  inTenYears.setFullYear(inTenYears.getFullYear() + 10)
  model.value = [tenYearsAgo, inTenYears]
}
</script>

<style scoped lang="sass">
.search-range-filter
	display: block
	font-size: 0.8em

	&__input
		margin-bottom: 1em

	&__action
		font-size: 0.8em
		margin-bottom: 1em
</style>
