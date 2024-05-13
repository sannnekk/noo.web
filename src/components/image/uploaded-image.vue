<template>
  <img :src="link" />
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import { computed } from 'vue'

interface Props {
  src?: string | File | undefined
}

const props = defineProps<Props>()

const link = computed(() => {
  if (typeof props.src === 'string' && props.src.startsWith('http'))
    return props.src

  if (typeof props.src === 'string' && props.src.startsWith('data:'))
    return props.src

  if (typeof props.src === 'string')
    return `${Core.Constants.MEDIA_URL}/${props.src}`

  if (props.src instanceof File) return URL.createObjectURL(props.src)

  return '/img/placeholder.svg'
})
</script>
