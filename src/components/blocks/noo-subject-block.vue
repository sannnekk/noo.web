<template>
  <div class="subject-name">
    <div
      class="subject-name__badge"
      :style="{ backgroundColor: subject.color }"
    ></div>
    <span class="subject-name__name">{{ subject.name }}</span>
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
  display: block
  padding: 0.25rem 0.5rem
  padding-left: 0
  border-radius: var(--border-radius)
  font-size: 1em
  font-weight: 500
  white-space: nowrap

  &__badge
    display: inline-block
    width: 0.3em
    height: 1em
    margin-right: 0.5em
    position: relative
    top: 0.1em
</style>
