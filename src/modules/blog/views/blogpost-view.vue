<template>
  <div
    class="blogpost-view"
    v-if="postStore.post"
  >
    <div class="blogpost-view__back">
      <common-button
        to="/blog"
        design="inline"
      >
        Назад к ленте
      </common-button>
    </div>
    <div class="blogpost-view__header">
      <h1>{{ postStore.post.title }}</h1>
      <div class="blogpost-view__header__info">
        <span class="blogpost-view__header__info__date">
          {{
            useDate(postStore.post.createdAt, {
              precision: 'day'
            }).toBeautiful()
          }}
        </span>
        |
        <span class="blogpost-view__header__info__author">{{
          postStore.post.author.name
        }}</span>
      </div>
    </div>
    <div class="blogpost-view__reactions">
      <blogpost-reactions
        :reactions="postStore.post.reactionCounts"
        :myReaction="postStore.post.myReaction"
        :loading="blogStore.isReactionLoading"
        @react="blogStore.reactToPost(postStore.post, $event)"
      />
    </div>
    <div class="blogpost-view__body">
      <rich-text-container
        :content="postStore.post.content"
        :key="postStore.post.id"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import blogpostReactions from '../components/blogpost-reactions.vue'
import { useDate } from '@/composables/useDate'
import { usePostStore } from '../stores/post'
import { useBlogStore } from '../stores/blog'
import { useRoute } from 'vue-router'
import { setPageTitle } from '@/core/utils/setPageTitle'

const route = useRoute()

const postStore = usePostStore()
const blogStore = useBlogStore()

postStore
  .fetchPost()
  .then(() => setPageTitle(postStore.post?.title || 'Пост не найден'))
</script>

<style lang="sass" scoped>
.blogpost-view
  padding: 3em

  @media (max-width: 768px)
    padding: 1em

  &__header
    margin-bottom: 1em
    padding: 0.5em

    &__info
      font-size: 0.8em
      color: #666

      &__date
        text-transform: capitalize

  &__reactions
    margin-bottom: 1em
</style>
