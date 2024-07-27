<template>
  <div class="list-pagination">
    <div
      class="list-pagination__item"
      v-for="page in pages"
      :key="page.number"
      :class="{
        'list-pagination__item--ellipsis': page.type === 'ellipsis',
        'list-pagination__item--active': page.number === props.page
      }"
      @click="changePage(page.number)"
    >
      {{ page.type === 'page' ? page.number : '...' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  page?: number
  total?: number
  limit?: number
}

interface Emits {
  (e: 'update:page', page: number): void
}

interface Page {
  number: number
  type: 'page' | 'ellipsis'
}

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  total: 1,
  limit: 25
})
const emit = defineEmits<Emits>()

const changePage = (page: number) => {
  emit('update:page', Number(page))
}

const pageCount = computed(() => Math.ceil(props.total / props.limit))

const pages = computed(() => {
  return Array.from({ length: pageCount.value }, (_, i) => i + 1)
    .map((page) => {
      if (
        page === 1 ||
        page === pageCount.value ||
        (page >= props.page - 2 && page <= props.page + 2)
      ) {
        return { number: page, type: 'page' }
      }

      return { number: page, type: 'ellipsis' }
    })
    .filter((page, i, arr) => {
      if (page.type === 'ellipsis') {
        return arr[i - 1].type !== 'ellipsis'
      }

      return true
    }) as Page[]
})
</script>

<style lang="sass" scoped>
.list-pagination
  display: flex
  gap: 8px
  padding: 16px 0
  justify-content: center
  align-items: center

  &__item
    display: flex
    align-items: center
    justify-content: center
    max-width: 3.5em
    min-width: 1.5em
    padding: 0 0.5em
    height: 1.5em
    border-radius: var(--border-radius)
    cursor: pointer
    font-size: 1.2em

    &:not(&--ellipsis):not(&--active):hover
      background-color: var(--border-color)

    &--ellipsis
      pointer-events: none
      user-select: none
      color: var(--border-color)
      cursor: default

    &--active
      background-color: var(--lila)
      color: var(--lightest)
</style>
