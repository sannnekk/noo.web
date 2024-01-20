<template>
  <img :src="link" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  src?: string
}

const props = defineProps<Props>()

const link = computed(() =>
  props.src && props.src.startsWith('http')
    ? props.src
    : `https://cdn.noo-school.ru/uploads/${props.src}`
)
</script>
