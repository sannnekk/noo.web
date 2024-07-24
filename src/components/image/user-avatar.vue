<template>
  <div class="user-avatar">
    <uploaded-image
      class="user-avatar__image"
      v-if="src"
      :src="src"
    />
    <span
      v-else
      class="user-avatar__initials"
      :style="{
        backgroundColor: bgColor
      }"
    >
      {{ initials }}
    </span>
    <div
      class="user-avatar__is-online"
      v-if="isOnline"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  src?: string
  name?: string
  isOnline?: boolean
}

const props = defineProps<Props>()

const initials = computed(() => {
  if (!props.name) return ''
  const [firstName, lastName] = props.name.split(' ')
  return `${(firstName || '-')[0]}${(lastName || ' ')[0]}`
    .toUpperCase()
    .replace(' ', '')
})

const bgColor = computed(() => {
  const colors = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#8bc34a',
    '#cddc39',
    '#ffeb3b',
    '#ffc107',
    '#ff9800',
    '#ff5722',
    '#795548',
    '#607d8b'
  ]
  const seed = initials.value
    .split('')
    .reduce((acc, char) => acc * char.charCodeAt(0), 1)

  return colors[seed % colors.length]
})
</script>

<style scoped lang="sass">
.user-avatar
  width: 1em
  height: 1em
  aspect-ratio: 1 / 1
  border-radius: 50%
  position: relative

  &__image
    display: block
    width: 1em
    object-position: center
    object-fit: cover
    background-color: var(--border-color)
    overflow: hidden
    aspect-ratio: 1 / 1
    border-radius: 50%

  &__initials
    color: var(--lightest)
    font-weight: bold
    font-size: 0.4em
    display: flex
    justify-content: center
    align-items: center
    width: 100%
    height: 100%
    overflow: hidden
    aspect-ratio: 1 / 1
    border-radius: 50%

  &__is-online
    position: absolute
    bottom: 0px
    right: 0px
    width: 15px
    height: 15px
    border-radius: 50%
    background-color: var(--success)
    border: 1px solid var(--lightest)
</style>
