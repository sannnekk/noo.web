<template>
  <div class="article-page">
    <div
      class="article-page__content"
      v-if="article"
    >
      <h2 class="article-page__title">
        {{ article.title }}
      </h2>
      <div class="article-page__content">
        <rich-text-container :content="article.content" />
      </div>
    </div>
    <div
      class="article-page__not-found"
      v-else
    >
      <nothing-found-image class="article-page__not-found__img" />
      <h3>{{ error || 'Статья не найдена' }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { FAQArticle } from '@/core/data/entities/FAQArticle'
import { ref } from 'vue'
interface Props {
  articleId: string
}

const props = defineProps<Props>()

const faqService = Core.Services.FAQ

const article = ref<FAQArticle | null>(null)
const error = ref<string | null>(null)

try {
  const response = await faqService.getArticle(props.articleId)
  article.value = response.data

  if (article.value === null) {
    error.value = 'Статья не найдена'
  }
} catch (error: any) {
  error.value = error.message
}
</script>

<style scoped lang="sass">
.article-page
	&__title
		margin-bottom: 1em
		padding: 8px

	&__not-found
		display: flex
		flex-direction: column
		align-items: center
		justify-content: center
		height: 100%
		width: 100%
		min-height: 500px

		&__img
			width: min(90%, 500px)
			height: auto

		h3
			margin-top: 20px
			font-weight: 500
			color: var(--form-text-color)
</style>
