<template>
  <span v-html="value"></span>
</template>

<script setup lang="ts">
interface Props {
  value?: string
}

defineProps<Props>()
</script>
