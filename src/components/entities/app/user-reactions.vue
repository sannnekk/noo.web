<template>
  <div class="user-reactions">
    <div class="user-reactions__list">
      <div
        class="user-reactions__list__item"
        v-for="reaction in reactionsModel"
        :key="reaction.reaction"
        @click="react(reaction.reaction)"
        :class="{
          'user-reactions__list__item--active':
            reaction.reaction === myReaction,
          'user-reactions__list__item--readonly': readonly
        }"
        v-auto-animate
      >
        <inline-emoji :name="reaction.reaction" />
        <span
          v-if="!loading && !hideNumbers"
          class="user-reactions__list__item__value"
          >{{ reaction.count }}</span
        >
        <span
          v-else-if="loading"
          class="user-reactions__list__item__value"
        >
          <loader-icon contrast />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  reactions: Record<string, number>
  myReaction?: string
  loading?: boolean
  hideNumbers?: boolean
  readonly?: boolean
}

interface Emits {
  (e: 'react', value: string): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const reactionsModel = computed(() => {
  return Object.entries(props.reactions).map(([reaction, count]) => ({
    reaction,
    count
  }))
})

function react(reaction: string) {
  if (props.loading) return

  emits('react', reaction)
}
</script>

<style lang="sass" scoped>
.user-reactions
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

      &:not(&--readonly):hover
        background-color: var(--info)
</style>
