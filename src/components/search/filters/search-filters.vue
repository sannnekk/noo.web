<template>
  <div
    class="search-filters"
    v-auto-animate
  >
    <div class="search-filters__header">
      <h4 @click="collpased = !collpased">
        Фильтры
        <beta-tag />
      </h4>
      <div
        class="search-filters__header__collapse-button"
        @click="collpased = !collpased"
      >
        <span>
          {{ collpased ? 'Развернуть' : 'Свернуть' }}
        </span>
      </div>
    </div>
    <div
      class="search-filters__body"
      v-if="!isLoading && !collpased"
    >
      <div class="row">
        <div
          class="search-filters__filter col-12 col-md-6 col-lg-3"
          v-for="filter in filters"
          :key="filter.key"
        >
          <h5 class="search-filters__filter__name">
            {{ filter.name }}
          </h5>
          <div class="search-filters__filter__component">
            <component
              :is="getFilterComponent(filter)"
              :filter="filter"
              :modelValue="getFilterValue(filter)"
              @update:model-value="setFilterValue(filter, $event)"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="search-filters__body__loading"
      v-else-if="isLoading"
    >
      <loader-icon contrast />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SearchFilter } from './SearchFilter'
import type { FilterType, Pagination } from '@/core/data/Pagination'

// filter components
import SearchArrayFilter from './search-array-filter.vue'
import SearchBooleanFilter from './search-boolean-filter.vue'
import SearchTagsFilter from './search-tags-filter.vue'
import SearchRangeFilter from './search-range-filter.vue'
import { emptyFilter } from './utils'
import { ref } from 'vue'

interface Props {
  pagination: Pagination
  filters: SearchFilter[]
  isLoading?: boolean
}

interface Emits {
  (event: 'update:pagination', value: Pagination): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const collpased = ref(true)

function getFilterValue(searchFilter: SearchFilter) {
  const filter = props.pagination[`filter[${searchFilter.key}]`]
  return filter ? filter.value : emptyFilter(searchFilter).value
}

function setFilterValue(
  searchFilter: SearchFilter,
  value: FilterType['value']
) {
  emits('update:pagination', {
    ...props.pagination,
    [`filter[${searchFilter.key}]`]: {
      type: searchFilter.type,
      value
    }
  })
}

function getFilterComponent(filter: SearchFilter) {
  switch (filter.type) {
    case 'arr':
      return SearchArrayFilter
    case 'boolean':
      return SearchBooleanFilter
    case 'tags':
      return SearchTagsFilter
    case 'range':
      return SearchRangeFilter
    default:
      throw new Error(`Unknown filter type: ${filter.type}`)
  }
}
</script>

<style scoped lang="sass">
.search-filters
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)
	padding: 1em
	border-radius: var(--border-radius)

	&__header
		display: flex
		user-select: none
		align-items: center

		h4
			flex: 1
			margin: 0

			&:hover
				cursor: pointer
				color: var(--lila)

		&__collapse-button
			color: var(--text-light)

			@media (max-width: 768px)
				font-size: 0.8em

			&:hover
				cursor: pointer
				color: var(--lila)


	&__filter
		padding: 0 1em

		&:not(:last-child)
			@media (min-width: 768px)
				border-right: 1px solid var(--border-color)

		&__name
			margin: 0
			margin-bottom: 1em

	&__body
		padding-top: 1em

		&__loading
			min-height: 100px
			display: flex
			justify-content: center
			align-items: center
			font-size: 40px
</style>
