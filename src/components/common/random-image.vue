<template>
  <img
    :src="sizes[props.size || 'medium']"
    alt="Random image"
  />
</template>

<script setup lang="ts">
interface Props {
  // small: < 120px
  // medium: < 680px
  // large: > 680px
  size?: 'small' | 'medium' | 'large'
}

const props = defineProps<Props>()

const sizes = {
  small: 'https://picsum.photos/120/120',
  medium: 'https://picsum.photos/680/680',
  large: 'https://picsum.photos/1920/1080'
}
</script>
