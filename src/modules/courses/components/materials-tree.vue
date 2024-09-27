<template>
  <ul
    class="materials-tree"
    :class="`lvl-${nestingLevel}`"
  >
    <li
      class="materials-tree__item"
      :class="{ 'materials-tree__item--opened': subject.opened }"
      v-for="subject in dataModel"
      :key="subject.id"
      v-auto-animate
    >
      <list-opener-arrow
        v-if="subject.children && !!subject.children.length"
        :opened="subject.opened"
        @click="subject.opened = !subject.opened"
      />
      <component
        :is="
          subject.children && subject.children.length ? 'span' : 'router-link'
        "
        @click="subject.opened = !subject.opened"
        class="materials-tree__item__name"
        :to="`/courses/${$route.params.courseSlug}/${subject.slug}`"
      >
        <inline-icon
          class="materials-tree__item__name__icon"
          name="uni-cap"
          v-if="subject.workId"
        />
        {{ subject.name }}
      </component>
      <materials-tree
        v-if="subject.children && subject.children.length && subject.opened"
        :data="subject.children"
        :nesting-level="nestingLevel + 1"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Course } from '@/core/data/entities/Course'
import { ref, watch } from 'vue'

interface Props {
  data: (Pick<Course, 'id' | 'name' | 'slug'> & {
    children?: Pick<Course, 'id' | 'name' | 'slug'>[]
    workId?: string
  })[]
  nestingLevel?: number
}

const props = withDefaults(defineProps<Props>(), {
  nestingLevel: 0
})

const dataModel = ref(
  props.data.map((subject) => ({
    ...subject,
    opened: false
  }))
)

watch(
  () => props.data,
  (data) => {
    dataModel.value = data.map((subject) => ({
      ...subject,
      opened: false
    }))
  }
)
</script>

<style scoped lang="sass">
.materials-tree
  user-select: none
  list-style: none
  margin: 0
  margin-top: 1em
  max-height: 80vh
  overflow-y: auto

  &:not(.lvl-0):not(.lvl-1)
    margin-left: 0.5rem
    padding-left: 1.8rem
    border-left: 1px solid var(--secondary)

  &.lvl-0
    padding-left: 0
    > .materials-tree__item
      > .materials-tree__item__name
        font-weight: bold

  &.lvl-1
    > .materials-tree__item
      > .materials-tree__item__name
        font-weight: 500

  &__item
    cursor: pointer
    margin-bottom: 0.3rem
    transition: all 0.2s ease-in-out
    overflow: hidden
    padding-bottom: 0.2em

    &__name
      text-decoration: none
      color: inherit
      line-height: 1.1

      &.router-link-active
        color: var(--lila)

      &:not(&.router-link-active):hover
        color: var(--secondary)

      &__icon
        font-size: 1.5em
        transform: translateY(0.3em)
</style>
