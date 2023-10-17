<template>
  <div class="task-list">
    <draggable-list
      v-model="model"
      item-key="id"
    >
      <template v-slot="{ item }">
        <div class="task-list__item">
          <router-link :to="`/create-work/${item.id}`">
            {{ item.name }}
          </router-link>
        </div>
      </template>
    </draggable-list>
    <div
      class="task-list__add"
      v-if="currentTaskId !== 'new'"
    >
      <router-link to="/create-work/new"> ➕ Добавить вопрос </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '@/types/entities/Task'
import { computed } from 'vue'

interface Props {
  modelValue: Task[]
  currentTaskId: string
}

interface Emits {
  (event: 'update:modelValue', value: Task[]): void
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
  padding-left: 0.5em
  margin: 0
  counter-reset: list

  &__add
    margin-top: 1rem
    font-weight: 400
    border: 1px solid var(--border-color)
    cursor: pointer
    border-radius: var(--border-radius)
    margin-left: -0.5em

    a
      color: var(--secondary)
      text-decoration: none
      display: block
      padding: 0.6em
      font-weight: bold
      border-radius: var(--border-radius)

      &:hover
        background-color: var(--text-light)
        color: var(--lightest) !important

  &__item
    display: block
    margin-bottom: 10px
    font-weight: 500
    line-height: 1

    &::before
      counter-increment: list
      content: counter(list)
      margin-right: 0.9em
      color: var(--secondary)

    a
      color: var(--text-light)
      text-decoration: none
      font-weight: normal

      &.router-link-active
        font-weight: bold
        color: var(--dark)

      &:not(.router-link-active):hover
        color: var(--secondary)
</style>
