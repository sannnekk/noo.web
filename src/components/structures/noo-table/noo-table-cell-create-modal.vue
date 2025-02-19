<template>
  <sure-modal
    v-if="cellModel"
    v-model:visible="visibilityModel"
    @confirm="onConfirm()"
  >
    <template #title> Создание ячейки </template>
    <template #text>
      <select-input
        label="Выберите тип ячейки"
        v-model="cellModel.type"
        :options="TableHashMap.cellTypeOptions"
      />
      <component
        :key="cellModel.id"
        :is="component"
        v-model="cellModel"
        v-model:is-valid="isValid"
      />
      <div
        v-if="!isValid[0]"
        class="error-block"
      >
        {{ isValid[1] }}
      </div>
      <cell-style-input
        v-model="cellModel"
        class="style-input"
      />
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
import { TableHashMap } from './TableHashMap'
import type { TableCell } from '@/core/data/entities/TableCell'
import { computed, ref, watch } from 'vue'
import { emptyCell } from './utils'

interface Props {
  visible: boolean
  x: number
  y: number
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

const cellModel = ref<TableCell>()
const isValid = ref<[boolean, string?]>([true])

watch(
  () => props.visible,
  (value) => {
    if (value) {
      cellModel.value = emptyCell('text', props.y, props.x)
    }
  },
  { immediate: true }
)

const component = computed(() => {
  switch (cellModel.value?.type) {
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

function onConfirm() {
  if (isValid.value[0]) {
    emits('confirm', cellModel.value!)
  }
}
</script>

<style lang="sass" scoped>
.style-input
	margin-top: 0.7em

.error-block
	font-size: 0.8em
	color: var(--danger)
</style>
