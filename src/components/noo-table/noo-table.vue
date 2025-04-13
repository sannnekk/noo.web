<template>
  <div class="noo-table">
    <table
      class="noo-table__table"
      :key="reloadTrigger"
    >
      <tr
        v-for="y in cellMap.sizeY"
        :key="`row-${y}`"
        :data-i="y"
        :data-size="cellMap.sizeY"
      >
        <td
          v-for="(cell, x) in cellMap.getRow(y)"
          :key="`cell-${y}-${x + 1}`"
          :style="{
            background: cell?.background || ''
          }"
        >
          <noo-table-cell
            :cell="cell"
            :key="cell?.value"
          />
          <div
            class="noo-table__table__actions"
            v-if="props.editable"
          >
            <inline-icon
              v-if="!cell"
              class="noo-table__table__actions__add"
              name="add"
              @click="onCellCreate(y, x + 1)"
            />
            <inline-icon
              v-if="cell"
              class="noo-table__table__actions__edit"
              name="edit"
              @click="onCellEdit(cell)"
            />
            <inline-icon
              v-if="cell"
              class="noo-table__table__actions__delete"
              name="delete"
              @click="onCellRemove(y, x + 1)"
            />
          </div>
        </td>
      </tr>
    </table>
    <div
      class="add-row-button"
      @click="cellMap.addRow()"
    >
      <inline-icon
        class="add-row-button__icon"
        name="add"
      />
      <span>Добавить строку</span>
    </div>
    <div
      class="add-col-button"
      @click="cellMap.addColumn()"
    >
      <inline-icon
        class="add-col-button__icon"
        name="add"
      />
      <span>Добавить столбец</span>
    </div>
  </div>
  <noo-table-cell-edit-modal
    :key="cellEditModal.cell?.id"
    v-if="cellEditModal.cell"
    v-model:visible="cellEditModal.visible"
    :cell="cellEditModal.cell"
    @confirm="cellMap.onmodify($event)"
  />
  <noo-table-cell-create-modal
    v-model:visible="cellCreateModal.visible"
    :x="cellCreateModal.x"
    :y="cellCreateModal.y"
    @confirm="cellMap.onmodify($event)"
  />
</template>

<script setup lang="ts">
import type { Table } from '@/core/data/entities/Table'
import { TableHashMap, type TableHashMapConfig } from './TableHashMap'
import { reactive, ref } from 'vue'
import type { TableCell } from '@/core/data/entities/TableCell'
import { deepCopy } from '@/core/utils/object'

interface Props {
  data: Table
  firstRowFixed?: boolean
  firstColumnFixed?: boolean
  editable?: boolean
}

interface Emits {
  (event: 'update:data', data: Table): void
}

const config: TableHashMapConfig = {
  /**
   * Amount of empty cols to be added to the right of the table
   */
  emptyXSpan: 1,
  /**
   * Amount of empty rows to be added to the bottom of the table
   */
  emptyYSpan: 1
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const reloadTrigger = ref(0)

const cellMap = new TableHashMap(
  props.data.cells,
  config,
  reloadTrigger,
  (newCells) => emits('update:data', { ...props.data, cells: newCells })
)

const cellEditModal = reactive({
  visible: false,
  cell: null as TableCell | null
})

const cellCreateModal = reactive({
  visible: false,
  x: 0,
  y: 0
})

function onCellCreate(y: number, x: number) {
  cellCreateModal.x = x
  cellCreateModal.y = y
  cellCreateModal.visible = true
}

function onCellEdit(cell: TableCell) {
  cellEditModal.cell = deepCopy(cell, false)
  setTimeout(() => {
    cellEditModal.visible = true
  }, 0)
}

function onCellRemove(y: number, x: number) {
  cellMap.removeValue(y, x)
}
</script>

<style scoped lang="sass">
.noo-table
	position: relative
	padding-bottom: 1.3em
	padding-right: 1.3em

	&__table
		border-collapse: collapse
		min-width: 100%

		*
			box-sizing: border-box

		tr
			height: 50px

			td
				border: 1px solid var(--border-color)
				padding: 0.1em 0.3em
				text-align: right
				min-width: 30px
				cursor: pointer
				position: relative

				&:hover
					background: var(--border-color)

					.noo-table__table__actions
						opacity: 1
						left: 100%
						transition: ease all 0.2s
						pointer-events: all

		&__actions
			position: absolute
			z-index: 5
			top: 50%
			left: 80%
			opacity: 0
			pointer-events: none
			cursor: pointer
			display: flex
			gap: 0.3em
			background: var(--form-background)
			font-size: 1em
			user-select: none
			transform: translateY(-50%)
			padding: 0.3em 0.5em
			box-shadow: 0 0 5px rgba(0, 0, 0, 0.5)
			border-radius: var(--border-radius)

			&::before
				content: ''
				position: absolute
				top: 50%
				left: -13px
				transform: translateY(-50%)
				width: 0
				height: 0
				border-right: 8px solid var(--form-background)
				border-left: 8px solid transparent
				border-top: 8px solid transparent
				border-bottom: 8px solid transparent

			&__add:hover
				:deep()
					path
						fill: var(--text-light) !important

			&__edit:hover
				:deep()
					path
						stroke: var(--text-light) !important

			&__delete:hover
				:deep()
					--danger: var(--text-light) !important

	.add-row-button, .add-col-button
		position: absolute
		color: var(--text-light)
		font-size: 0.8em
		cursor: pointer
		user-select: none

		span
			position: relative
			top: -2px

		&:hover
			color: var(--text)

		&__icon
			margin-right: 0.3em

	.add-row-button
		bottom: 0
		right: 1.4em
		z-index: 1

	.add-col-button
		bottom: 1.8em
		right: 1.4em
		z-index: 1
		transform: rotate(90deg) translateY(-0em)
		transform-origin: 100% 100%
</style>
