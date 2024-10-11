<template>
  <ul
    class="materials-tree"
    :class="`lvl-${nestingLevel}`"
  >
    <li
      class="materials-tree__item"
      :class="{ 'materials-tree__item--opened': item.opened }"
      v-for="item in dataModel"
      :key="item.id"
      v-auto-animate
    >
      <list-opener-arrow
        v-if="item.children && !!item.children.length"
        :opened="item.opened"
        @click="item.opened = !item.opened"
      />
      <component
        :is="item.children && item.children.length ? 'span' : 'router-link'"
        @click="item.opened = !item.opened"
        class="materials-tree__item__name"
        :to="`/courses/${$route.params.courseSlug}/${item.slug}`"
      >
        <inline-icon
          class="materials-tree__item__name__icon"
          name="uni-cap"
          v-if="item.workId"
        />
        {{ item.name }}
        <inline-emoji
          class="materials-tree__item__name__reaction"
          v-if="item.myReaction && Core.Context.roleIs(['student'])"
          :name="item.myReaction"
        />
      </component>
      <materials-tree
        v-if="item.children && item.children.length && item.opened"
        :data="item.children"
        :nesting-level="nestingLevel + 1"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { Chapter } from '@/core/data/entities/Chapter'
import type { Course } from '@/core/data/entities/Course'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

interface Props {
  data: (Pick<Course, 'id' | 'name' | 'slug'> & {
    children?: Pick<Course, 'id' | 'name' | 'slug'>[]
    workId?: string
    myReaction?: string
  })[]
  nestingLevel?: number
}

const props = withDefaults(defineProps<Props>(), {
  nestingLevel: 0
})

const route = useRoute()
const materialSlug = computed(() => route.params.slug)

const dataModel = ref(
  props.data.map((chapter) => ({
    ...chapter,
    opened: false
  }))
)

watch(
  () => props.data,
  (data) => {
    dataModel.value = data.map((chapter) => ({
      ...chapter,
      opened: chapterIsOpened(chapter as Chapter)
    }))
  },
  { deep: true, immediate: true }
)

function chapterIsOpened(chapter: any) {
  const opened = chapter.children?.some(
    (child: any) => materialSlug.value === child.slug
  )

  return opened === undefined ? false : opened
}
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

      &__reaction
        font-size: 1em
</style>
