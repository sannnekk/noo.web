<template>
  <div class="blog-list">
    <div
      class="blog-list__cards"
      v-if="!loading && props.posts.length"
    >
      <blogpost-card
        v-for="post in props.posts"
        :key="post.id"
        :post="post"
        :is-reaction-loading="props.isReactionLoading"
        @react="
          emits('react', {
            postId: post.id,
            reaction: $event
          })
        "
        @delete="emits('delete', $event)"
      />
    </div>
    <div
      class="blog-list__loading"
      v-else-if="loading"
    >
      <loader-icon contrast />
    </div>
    <div
      class="blog-list__not-found"
      v-else
    >
      <div class="blog-list__not-found__image">
        <nothing-found-image />
      </div>
      <p class="blog-list__not-found__text">Посты не найдены</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import BlogpostCard from './blogpost-card.vue'
import type { BlogPost, Reaction } from '@/core/data/entities/BlogPost'

interface Props {
  posts: BlogPost[]
  loading?: boolean
  isReactionLoading?: boolean
}

interface Emits {
  (
    e: 'react',
    value: {
      postId: BlogPost['id']
      reaction: Reaction
    }
  ): void
  (e: 'delete', value: BlogPost['id']): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const reactionsModel = ref<Record<BlogPost['id'], Reaction>>({})

watch(
  reactionsModel,
  (oldValue, newValue) => {
    console.log('reactionsModel changed', oldValue, newValue)
  },
  { deep: true }
)
</script>

<style lang="sass" scoped>
.blog-list

  &__loading
    display: flex
    justify-content: center
    align-items: center
    height: 200px
    font-size: 4em

  &__not-found
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    height: 500px
    color: var(--text-light)
    line-height: 1.5
    text-align: center

    &__image
      margin-bottom: 1em
      width: min(90%, 500px)

      > *
        width: 100%
        height: auto

    &__text
      margin-top: 1em
</style>
