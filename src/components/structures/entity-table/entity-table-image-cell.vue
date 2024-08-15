<template>
  <uploaded-image
    class="entity-table-image-cell"
    :src="value?.src"
  />
</template>

<script setup lang="ts">
import type { Media } from '@/core/data/entities/Media'

interface Props {
  value?: Media
}

defineProps<Props>()
</script>

<style lang="sass" scoped>
.entity-table-image-cell
	width: 2em
	height: 2em
</style>
