import type { Table } from '@/core/data/entities/Table'
import type { TableCell } from '@/core/data/entities/TableCell'
import type { Ref } from 'vue'

export interface TableHashMapConfig {
  emptyXSpan: number
  emptyYSpan: number
}

const cellTypeOptions = [
  { value: 'text', label: 'Текст' },
  { value: 'number', label: 'Число' },
  { value: 'percentage', label: 'Процент' },
  { value: 'date', label: 'Дата' },
  { value: 'user', label: 'Пользователь' },
  { value: 'work', label: 'Работа' },
  { value: 'formula', label: 'Формула' }
]

/**
 * TableHashMap is a class that represents a table as a hashmap.
 *
 * @note the col and row indexes start from 1, not 0.
 */
export class TableHashMap extends Map<string, TableCell> {
  #dimX: number

  #sizeX: number

  #dimY: number

  #sizeY: number

  #modifiedCells: Record<string, TableCell> = {}

  #reloadTrigger: Ref<number>

  #onUpdate: (cell: TableCell[]) => void

  static cellTypeOptions = cellTypeOptions

  constructor(
    cells: TableCell[],
    config: TableHashMapConfig,
    reloadTrigger: Ref<number>,
    onUpdate: (cells: TableCell[]) => void
  ) {
    super()
    cells.forEach((cell) => this.setValue(cell, false))

    this.#dimX = this.#getXDim(cells)
    this.#dimY = this.#getYDim(cells)

    this.#sizeX = this.#dimX + config.emptyXSpan
    this.#sizeY = this.#dimY + config.emptyYSpan

    this.#reloadTrigger = reloadTrigger
    this.#onUpdate = onUpdate
  }

  setValue(cell: TableCell, triggerUpdate: boolean = false): void {
    super.set(`${cell.row}-${cell.col}`, cell)

    if (triggerUpdate) {
      this.#triggerUpdate()
    }
  }

  getValue(row: number, col: number): TableCell | undefined {
    return super.get(`${row}-${col}`)
  }

  getRow(row: number): (TableCell | undefined)[] {
    const cells: (TableCell | undefined)[] = []

    for (let i = 1; i <= this.#sizeX; i++) {
      cells.push(this.getValue(row, i))
    }

    return cells
  }

  removeValue(row: number, col: number): void {
    super.delete(`${row}-${col}`)
    this.#triggerUpdate()
  }

  get dimX(): number {
    return this.#dimX
  }

  get dimY(): number {
    return this.#dimY
  }

  get sizeX(): number {
    return this.#sizeX
  }

  get sizeY(): number {
    return this.#sizeY
  }

  get isModified(): boolean {
    return Object.entries(this.#modifiedCells).length > 0
  }

  onmodify(cell: TableCell): void {
    this.#modifiedCells[cell.id] = cell
    this.setValue(cell)
  }

  addRow(): void {
    this.#sizeY++
    this.#triggerUpdate()
  }

  addColumn(): void {
    this.#sizeX++
    this.#triggerUpdate()
  }

  removeRow(): void {
    if (this.#sizeY < 3) {
      return
    }

    this.#sizeY--
    this.delete(`${this.#sizeY}-`) // remove all cells in the last row
    this.#triggerUpdate()
  }

  removeColumn(): void {
    if (this.#sizeX < 3) {
      return
    }

    this.#sizeX--
    this.delete(`-${this.#sizeX}`) // remove all cells in the last column
    this.#triggerUpdate()
  }

  #triggerUpdate(): void {
    this.#onUpdate(Array.from(this.values()))
    this.#reloadTrigger.value++
  }

  #getXDim(cells: TableCell[]): number {
    return cells.length ? Math.max(...cells.map((cell) => cell.col)) : 10
  }

  #getYDim(cells: TableCell[]): number {
    return cells.length ? Math.max(...cells.map((cell) => cell.row)) : 5
  }
}
