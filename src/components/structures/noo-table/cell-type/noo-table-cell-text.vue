<template>
  <div class="noo-table-cell-text">
    {{ value }}
  </div>
</template>

<script lang="ts" setup>
interface Props {
  value: string
}

defineProps<Props>()
</script>
