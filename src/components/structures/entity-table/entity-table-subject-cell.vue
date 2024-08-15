<template>
  <span>
    <subject-name :subject="value" />
  </span>
</template>

<script setup lang="ts">
import type { Subject } from '@/core/data/entities/Subject'

interface Props {
  value?: Subject
}

defineProps<Props>()
</script>
