<template>
  <div class="user-avatar">
    <img
      class="user-avatar__image"
      v-if="src"
      :src="src"
    />
    <span
      v-else
      class="user-avatar__initials"
    >
      {{ initials }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  src?: string
  name: string
}

const props = defineProps<Props>()

const initials = computed(() => {
  const [firstName, lastName] = props.name.split(' ')
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
})
</script>

<style scoped lang="sass">
.user-avatar
  width: 1em
  height: 1em
  aspect-ratio: 1 / 1
  border-radius: 50%
  overflow: hidden

  &__image
    display: block
    width: 1em
    object-position: center
    object-fit: cover

  &__initials
    background-color: var(--primary)
    color: var(--lightest)
    font-weight: bold
    font-size: 0.4em
    display: flex
    justify-content: center
    align-items: center
    width: 100%
    height: 100%
</style>
