<template>
  <div class="blogpost-reactions">
    <div class="blogpost-reactions__list">
      <div
        class="blogpost-reactions__list__item"
        v-for="reaction in reactionsModel"
        :key="reaction.reaction"
        @click="react(reaction.reaction)"
        :class="{
          'blogpost-reactions__list__item--active':
            reaction.reaction === myReaction
        }"
        v-auto-animate
      >
        <inline-emoji :name="reaction.reaction" />
        <span
          v-if="!loading"
          class="blogpost-reactions__list__item__value"
          >{{ reaction.count }}</span
        >
        <span
          v-else
          class="blogpost-reactions__list__item__value"
        >
          <loader-icon contrast />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Reaction } from '@/core/data/entities/BlogPost'
import { computed } from 'vue'

interface Props {
  reactions: Record<Reaction, number>
  myReaction?: Reaction
  loading?: boolean
}

interface Emits {
  (e: 'react', value: Reaction): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const reactionsModel = computed(() => {
  const reactions = Object.entries(props.reactions).map(
    ([reaction, count]) => ({
      reaction,
      count
    })
  )

  return reactions as { reaction: Reaction; count: number }[]
})

function react(reaction: Reaction) {
  if (props.loading) return

  emits('react', reaction)
}
</script>

<style lang="sass" scoped>
.blogpost-reactions
  &__list
    display: flex
    gap: 1em

    @media screen and (max-width: 768px)
      gap: 0.5em
      flex-wrap: wrap

    &__item
      display: flex
      gap: 0.5em
      align-items: center
      cursor: pointer
      border-radius: 5em
      background-color: var(--light-background-color)
      padding: 0.2em 0.6em

      &--active
        background-color: var(--lila)

      &:hover
        background-color: var(--info)
</style>
