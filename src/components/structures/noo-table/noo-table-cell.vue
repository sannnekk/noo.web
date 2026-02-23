<template>
  <component
    v-if="cell"
    :key="cell.value"
    :is="component"
    :value="parsedValue"
    :editable="editable"
  />
</template>

<script lang="ts" setup>
import nooTableCellText from './cell-type/noo-table-cell-text.vue'
import nooTableCellNumber from './cell-type/noo-table-cell-number.vue'
import nooTableCellPercentage from './cell-type/noo-table-cell-percentage.vue'
import nooTableCellUser from './cell-type/noo-table-cell-user.vue'
import nooTableCellWork from './cell-type/noo-table-cell-work.vue'
import nooTableCellDate from './cell-type/noo-table-cell-date.vue'
import nooTableCellFormula from './cell-type/noo-table-cell-formula.vue'

import type { TableCell } from '@/core/data/entities/TableCell'
import { computed } from 'vue'
import { TableFormula } from './TableFormula'

interface Props {
  cell?: TableCell
  editable?: boolean
}

const props = defineProps<Props>()

const parsedValue = computed(() => {
  if (!props.cell) return null

  switch (props.cell.type) {
    case 'text':
      return props.cell.value
    case 'user':
    case 'work':
      return props.cell.metadata
    case 'number':
    case 'percentage':
      return parseFloat(props.cell.value)
    case 'date':
      return new Date(props.cell.value)
    case 'formula':
      return new TableFormula(props.cell.value) // TODO: Implement formula
    default:
      return props.cell.value
  }
})

const component = computed(() => {
  if (!props.cell) return 'span'

  switch (props.cell.type) {
    case 'text':
      return nooTableCellText
    case 'number':
      return nooTableCellNumber
    case 'percentage':
      return nooTableCellPercentage
    case 'user':
      return nooTableCellUser
    case 'work':
      return nooTableCellWork
    case 'date':
      return nooTableCellDate
    case 'formula':
      return nooTableCellFormula
    default:
      return 'span'
  }
})
</script>
