<template>
  <div class="noo-table-cell-percentage">{{ value }}%</div>
</template>

<script lang="ts" setup>
interface Props {
  value: number
}

defineProps<Props>()
</script>
