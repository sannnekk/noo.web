<template>
  <div
    class="task-list"
    v-auto-animate
  >
    <draggable-list
      v-model="model"
      item-key="slug"
      class="task-list__items"
      :prompt-before-drag="true"
    >
      <template v-slot="{ item }">
        <div
          class="task-list__item"
          :class="{ 'task-list__item--new': item.id === undefined }"
        >
          <router-link
            :to="`/create-work${$route.params.workSlug}/${item.slug}`"
          >
            {{ item.order }}
          </router-link>
        </div>
      </template>
    </draggable-list>
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
    <div
      class="task-list__add"
      v-if="model.length === 0"
    >
      <inline-button
        icon="add"
        @click="$emit('create-from-template', 'trial-work')"
      >
        Создать пробник
      </inline-button>
      <inline-button
        icon="add"
        @click="$emit('create-from-template', 'test-50')"
      >
        Создать тест (50)
      </inline-button>
      <inline-button
        icon="add"
        @click="$emit('create-from-template', 'test-100')"
      >
        Создать тест (100)
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
  (
    event: 'create-from-template',
    template: 'trial-work' | 'test-50' | 'test-100'
  ): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => {
    emits(
      'update:modelValue',
      value.map((item, index) => {
        item.order = index + 1
        return item
      })
    )
  }
})
</script>

<style scoped lang="sass">
:deep() .task-list
  margin: 0
  padding: 0.5em 0

  &__add
    margin-top: 1em

  &__items
    display: flex
    flex-direction: row
    flex-wrap: wrap
    gap: 0.2em
    max-height: 305px
    overflow-y: auto

  &__item
    position: relative

    &--new
      &::after
        content: 'new'
        position: absolute
        top: -2px
        right: 0px
        padding: 1px 2px
        background-color: var(--danger)
        color: #000
        border-radius: var(--border-radius)
        font-size: 8px
        line-height: 10px
        font-weight: bold

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
