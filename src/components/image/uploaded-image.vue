<template>
  <img :src="link" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  src?: string | File
}

const props = defineProps<Props>()

const link = computed(() => {
  if (!props.src) return '/img/placeholder.png'

  if (typeof props.src === 'string' && props.src.startsWith('http'))
    return props.src

  if (typeof props.src === 'string' && props.src.startsWith('data:'))
    return props.src

  if (typeof props.src === 'string')
    return `https://cdn.noo-school.ru/uploads/${props.src}`

  if (props.src instanceof File) return URL.createObjectURL(props.src)

  return '/img/placeholder.png'
})
</script>
