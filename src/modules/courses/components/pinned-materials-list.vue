<template>
  <div
    class="pinned-materials-list"
    v-if="pinnedMaterials.length"
  >
    <div
      class="pinned-materials-list__item"
      v-for="material in pinnedMaterials"
      :key="material.id"
    >
      <router-link
        :to="`/courses/${$route.params.courseSlug}/${material.slug}`"
        class="pinned-materials-list__item__link"
      >
        <inline-icon
          class="pinned-materials-list__item__link__icon"
          name="pin"
        />
        <inline-icon
          class="pinned-materials-list__item__link__icon"
          name="uni-cap"
          v-if="material.workId"
        />
        <span
          :style="{
            color: material.titleColor ?? 'var(--form-text-color)'
          }"
        >
          {{ material.name }}
        </span>
        <inline-emoji
          class="pinned-materials-list__item__link__reaction"
          v-if="material.myReaction && Core.Context.roleIs(['student'])"
          :name="material.myReaction"
        />
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import { computed } from 'vue'

interface Props {
  chapters: Chapter[]
}

const props = withDefaults(defineProps<Props>(), {
  chapters: () => []
})

const pinnedMaterials = computed(() => {
  const pinnedMaterials = []

  for (const chapter of props.chapters) {
    if (chapter.chapters?.length) {
      for (const subChapter of chapter.chapters) {
        if (subChapter.materials?.length) {
          for (const material of subChapter.materials) {
            if (material.isPinned) {
              pinnedMaterials.push(material)
            }
          }
        }
      }
    } else if (chapter.materials?.length) {
      for (const material of chapter.materials) {
        if (material.isPinned) {
          pinnedMaterials.push(material)
        }
      }
    }
  }

  return pinnedMaterials
})
</script>

<style scoped lang="sass">
.pinned-materials-list
	padding: 0.5em 0
	border-bottom: 1px dashed var(--border-color)
	margin-bottom: 0.5em

	&__item
		display: flex
		align-items: center

		&__link
			display: flex
			align-items: center
			color: var(--text-light)
			text-decoration: none

			&.router-link-active
				font-weight: bold

			&__icon
				font-size: 1em
				margin-right: 0.5em

			&__reaction
				margin-left: 0.5em
</style>
