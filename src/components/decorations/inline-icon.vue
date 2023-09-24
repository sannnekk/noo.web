<template>
  <fa-icon :icon="name" />
</template>

<script setup lang="ts">
interface Props {
  name: string
}

defineProps<Props>()
</script>
