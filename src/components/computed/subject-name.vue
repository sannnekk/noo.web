<template>
  <div class="subject-name">
    <span :style="{ color: subject.color }">{{ subject.name }}</span>
  </div>
</template>

<script setup lang="ts">
import type { Subject } from '@/core/data/entities/Subject'

interface Props {
  subject: Subject
}

defineProps<Props>()
</script>

<style scoped lang="sass">
.subject-name
  display: inline-block
  padding: 0.25rem 0.5rem
  border-radius: 0.25rem
  background-color: #f0f0f0
  font-size: 0.875rem
  font-weight: 500
  color: #333
  margin-right: 0.5rem
  margin-bottom: 0.5rem
  cursor: pointer
  transition: background-color 0.2s

  &:hover
    background-color: #e0e0e0
</style>
