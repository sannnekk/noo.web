<template>
  <Suspense>
    <article-page :article-id="articleId" />
    <template #fallback>
      <div class="content-loading">
        <loader-icon contrast />
      </div>
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import ArticlePage from '../components/article-page.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const articleId = computed(() => route.params.id as string)
</script>

<style lang="sass" scoped>
.content-loading
	display: flex
	justify-content: center
	align-items: center
	height: 100%
	width: 100%
	min-height: 500px
	font-size: 40px
</style>
