<template>
  <span>
    <subject-name
      v-if="value"
      :subject="value"
    />
    <span v-else>-</span>
  </span>
</template>

<script setup lang="ts">
import type { Subject } from '@/core/data/entities/Subject'

interface Props {
  value?: Subject | null
}

defineProps<Props>()
</script>
