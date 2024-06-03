<template>
  <div class="blogpost-search-options">
    <div class="blogpost-search-options__title">
      <h3>Теги</h3>
    </div>
    <div class="blogpost-search-options__section">
      <tag-input
        label="Введите тег"
        v-model="model['filter[tags]'].value"
      />
    </div>
    <div class="blogpost-search-options__title">
      <h3>Дата</h3>
    </div>
    <div class="blogpost-search-options__section">
      <form-input
        type="date"
        label="Дата от"
        v-model="(model['filter[createdAt]'].value as any)[0]"
      />
      <form-input
        type="date"
        label="Дата до"
        v-model="(model['filter[createdAt]'].value as any)[1]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDate } from '@/composables/useDate'
import type { useSearch } from '@/composables/useSearch'
import type { Pagination } from '@/core/data/Pagination'
import { reactive, watch } from 'vue'

interface Props {
  pagination: Pagination
}

interface Emits {
  (e: 'update:pagination', value: Pagination): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const { yesterday, today } = useDate(new Date(), { precision: 'day' })

const model = reactive<Pagination>({
  ...props.pagination,
  'filter[tags]': {
    type: 'tags',
    value: []
  },
  'filter[createdAt]': {
    type: 'range',
    value: [yesterday(), today()]
  }
})

watch(
  model,
  () => {
    emits('update:pagination', model)
  },
  { deep: true }
)
</script>

<style lang="sass" scoped>
.blogpost-search-options
	&__title
		margin-top: 0em
		margin-bottom:-1em

	&__section
		font-size: 1rem
</style>
