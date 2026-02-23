<template>
  <inline-icon
    v-if="value"
    :name="value"
  />
</template>

<script setup lang="ts">
import type { IconName } from '@/components/decorations/inline-icon.vue'

interface Props {
  value?: IconName
}

defineProps<Props>()
</script>
