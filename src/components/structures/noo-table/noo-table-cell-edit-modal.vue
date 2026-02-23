<template>
  <sure-modal
    v-model:visible="visibilityModel"
    @confirm="onConfirm()"
  >
    <template #title> Изменение ячейки </template>
    <template #text>
      <component
        :key="cellModel.id"
        :is="component"
        :type="cell.type"
        v-model="cellModel"
        v-model:is-valid="isValid"
      />
      <cell-style-input
        v-model="cellModel"
        class="style-input"
      />
      <error-block
        v-if="!isValid[0]"
        class="error-block"
      >
        {{ isValid[1] }}
      </error-block>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import nooTableCellEditDate from './cell-edit/noo-table-cell-edit-date.vue'
import nooTableCellEditUser from './cell-edit/noo-table-cell-edit-user.vue'
import nooTableCellEditText from './cell-edit/noo-table-cell-edit-text.vue'
import nooTableCellEditNumber from './cell-edit/noo-table-cell-edit-number.vue'
import nooTableCellEditPercentage from './cell-edit/noo-table-cell-edit-percentage.vue'
import nooTableCellEditWork from './cell-edit/noo-table-cell-edit-work.vue'
import nooTableCellEditFormula from './cell-edit/noo-table-cell-edit-formula.vue'
import type { TableCell } from '@/core/data/entities/TableCell'
import { computed, ref } from 'vue'

interface Props {
  visible: boolean
  cell: TableCell
}

interface Emits {
  (event: 'update:visible', value: boolean): void
  (event: 'confirm', cell: TableCell): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const visibilityModel = computed({
  get: () => props.visible,
  set: (value: boolean) => emits('update:visible', value)
})

const isValid = ref<[boolean, string?]>([true])
const cellModel = ref(props.cell)

function onConfirm() {
  if (isValid.value[0]) {
    emits('confirm', cellModel.value)
  }
}

const component = computed(() => {
  switch (cellModel.value.type) {
    case 'date':
      return nooTableCellEditDate
    case 'user':
      return nooTableCellEditUser
    case 'text':
      return nooTableCellEditText
    case 'number':
      return nooTableCellEditNumber
    case 'percentage':
      return nooTableCellEditPercentage
    case 'work':
      return nooTableCellEditWork
    case 'formula':
      return nooTableCellEditFormula
    default:
      return nooTableCellEditText
  }
})
</script>

<style lang="sass" scoped>
.style-input
	margin-top: 0.7em

.error-block
	margin-top: 1.3em
	font-size: 0.8em
</style>
