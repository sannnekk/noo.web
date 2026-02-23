<template>
  <div class="noo-table-cell-formula">[FORMULA]</div>
</template>

<script lang="ts" setup>
import { TableFormula } from '../TableFormula'

interface Props {
  value: TableFormula
}

defineProps<Props>()
</script>
