<template>
  <ul
    class="materials-tree"
    :class="`lvl-${nestingLevel}`"
  >
    <li
      class="materials-tree__item"
      :class="{
        'materials-tree__item--opened': item.opened,
        'materials-tree__item--is-unactive': !item.isActive
      }"
      v-for="item in dataModel.filter(isVisible)"
      :key="item.id"
      v-auto-animate
    >
      <inline-icon
        v-if="item.isPinned && isPinned"
        class="materials-tree__item__name__pin"
        name="pin"
      />
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
        <span
          :style="{
            color: item.titleColor ?? 'var(--form-text-color)'
          }"
        >
          {{ item.name }}
        </span>
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
        :show-hidden="showHidden"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { Chapter } from '@/core/data/entities/Chapter'
import type { Material } from '@/core/data/entities/Material'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

interface Props {
  data: (Pick<
    Material,
    'id' | 'name' | 'titleColor' | 'isPinned' | 'slug' | 'isActive'
  > & {
    children?: Pick<Material, 'id' | 'name' | 'slug' | 'isActive'>[]
    workId?: string
    myReaction?: string
  })[]
  nestingLevel?: number
  isPinned?: boolean
  showHidden?: boolean
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

function isVisible(item: Material): boolean {
  if (
    Core.Context.roleIs(['teacher', 'admin']) &&
    (item.isActive || props.showHidden)
  ) {
    return props.isPinned ? item.isPinned : !item.isPinned
  }

  if (
    Core.Context.roleIs(['student', 'mentor', 'assistant']) &&
    item.isActive
  ) {
    return props.isPinned ? item.isPinned : !item.isPinned
  }

  return false
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

    &--is-unactive
      opacity: 0.7

      &::before
        content: ''
        background-color: var(--danger)
        border-radius: 50%
        width: 0.5em
        height: 0.5em
        display: inline-block
        margin-right: 0.5em

    &__name
      text-decoration: none
      color: inherit
      line-height: 1.1

      &.router-link-active
        font-weight: bold !important
        color: var(--secondary)
        text-decoration: none

      &:not(&.router-link-active):hover
        text-decoration: underline

      &__pin
        position: relative
        font-size: 1em
        top: 2px
        margin-right: 4px

      &__icon
        font-size: 1.5em
        transform: translateY(0.3em)

      &__reaction
        font-size: 1em
</style>
