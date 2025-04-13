<template>
  <span>
    {{ value }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  value?: number
}

defineProps<Props>()
</script>
