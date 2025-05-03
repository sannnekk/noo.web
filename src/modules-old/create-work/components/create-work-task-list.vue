<template>
  <div
    class="task-list"
    v-auto-animate
  >
    <div class="task-list__items">
      <div
        class="task-list__item"
        v-for="(item, index) in model"
        :key="item.id"
      >
        <router-link :to="`/create-work${$route.params.workSlug}/${item.slug}`">
          {{ index + 1 }}
        </router-link>
      </div>
    </div>
    <div
      class="task-list__add"
      v-if="currentTaskId !== 'new'"
    >
      <inline-button
        icon="add"
        @click="$emit('create-task')"
      >
        Добавить вопрос
      </inline-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '@/core/data/entities/Task'
import { computed } from 'vue'

interface Props {
  modelValue: Task[]
  currentTaskId?: string
}

interface Emits {
  (event: 'update:modelValue', value: Task[]): void
  (event: 'create-task'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})
</script>

<style scoped lang="sass">
.task-list
  padding: 0
  margin: 0
  max-height: 305px
  overflow-y: auto

  &__add
    margin-top: 1em

  &__items
    display: flex
    flex-direction: row
    flex-wrap: wrap
    gap: 0.2em

  &__item
    a
      font-weight: 500
      display: grid
      place-items: center
      width: 35px
      height: 35px
      border-radius: var(--border-radius)
      border: 1px solid var(--border-color)
      color: var(--form-text-color)
      text-decoration: none
      font-weight: normal

      &:hover
        background-color: var(--text-light)
        color: var(--lightest) !important

      &.router-link-active
        font-weight: bold
        color: var(--dark)
        background-color: var(--primary)
        border-color: var(--primary)
</style>
