<template>
  <ul
    class="faq-category-tree"
    :class="nestingLevel ? `faq-category-tree--nested-${nestingLevel}` : ''"
    v-for="category in categoryTree"
    :key="category.id"
  >
    <li v-auto-animate>
      <h4
        class="faq-category-tree__category-title"
        @click="category.opened = !category.opened"
      >
        <list-opener-arrow
          class="faq-category-tree__category-title__opener"
          v-if="category.childCategories?.length || category.articles?.length"
          :opened="category.opened"
        />
        {{ category.name }}
      </h4>
      <faq-category-tree
        v-if="category.childCategories?.length && category.opened"
        :categories="category.childCategories"
        :nestingLevel="nestingLevel ? nestingLevel + 1 : 1"
      />
      <ul
        v-if="
          (category.childCategories?.length || category.articles?.length) &&
          category.opened
        "
        class="faq-category-tree__article-list"
        :class="`faq-category-tree__article-list--nested-${
          (nestingLevel || 0) + 1
        }`"
      >
        <li
          v-for="article in category.articles"
          :key="article.id"
          class="faq-category-tree__article-list__item"
        >
          <router-link :to="`/help/article-${article.id}`">
            {{ article.title }}
          </router-link>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { FAQCategory } from '@/core/data/entities/FAQCategory'
import { ref, watch } from 'vue'

interface Props {
  categories: FAQCategory[]
  nestingLevel?: number
}

const props = defineProps<Props>()

const categoryTree = ref(toCollapsable(props.categories))

watch(
  () => props.categories,
  () => {
    categoryTree.value = toCollapsable(props.categories)
  },
  { deep: true }
)

function toCollapsable(
  categories: FAQCategory[]
): (FAQCategory & { opened: boolean })[] {
  return categories.map((category) => ({
    ...category,
    opened: false,
    childCategories: toCollapsable(category.childCategories || [])
  }))
}
</script>

<style scoped lang="sass">
.faq-category-tree
	list-style: none
	padding-left: 0

	&--nested-1
		margin-left: 1.5em

	&--nested-2
		margin-left: 3em

	&__article-list
		list-style: none
		padding: 0

		&--nested-1
			margin-left: 1.5em

		&--nested-2
			margin-left: 3em

		&--nested-3
			margin-left: 4.5em

	&__category-title
		font-weight: normal
		margin: 0
		padding: 0
		user-select: none
		cursor: pointer

		&:hover
			color: var(--lila)

		&__opener
			width: 1em

	:deep()
		a
			color: var(--form-text-color)
			text-decoration: none

			&:hover
				color: var(--lila)
</style>
