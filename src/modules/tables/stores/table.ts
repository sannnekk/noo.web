import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { Table } from '@/core/data/entities/Table'
import type { TableCell } from '@/core/data/entities/TableCell'
import { entityFactory } from '@/core/utils/entityFactory'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useTableStore = defineStore('tables-module:table', () => {
  const uiService = Core.Services.UI
  const tableService = Core.Services.Table
  const router = useRouter()

  const search = useSearch(fetchTables, { immediate: false })

  async function fetchTables(pagination?: Pagination) {
    try {
      return tableService.getTables(pagination)
    } catch (error: any) {
      uiService.openErrorModal(
        'Не удалось загрузить список таблиц',
        error.message
      )
    }
  }

  const currentTable = ref<Table>(entityFactory<Table>('table'))

  async function loadTable(tableId: Table['id']) {
    try {
      const response = await tableService.getTable(tableId, {
        showLoader: true
      })

      currentTable.value = response.data!
    } catch (error: any) {
      uiService.openErrorModal(
        'Произошла ошибка при загрузке таблицы',
        error?.message
      )
    }
  }

  async function saveTable() {
    try {
      if (!validateTable(currentTable.value)) {
        return
      }

      currentTable.value.cells = currentTable.value.cells.map((cell) => {
        return {
          ...cell,
          id: undefined
        } as any as TableCell
      })

      const response = await tableService.createTable(currentTable.value, {
        showLoader: true
      })

      currentTable.value.id = response.data!.id

      uiService.openSuccessModal('Таблица сохранена', undefined, [
        {
          label: 'Вернуться в список',
          design: 'primary',
          handler: () => {
            router.push('/tables')
          }
        }
      ])
    } catch (error: any) {
      uiService.openErrorModal('Не удалось сохранить таблицу', error.message)
    }
  }

  function validateTable(table: Table): boolean {
    if (table.title.length < 2 || table.title.length > 250) {
      uiService.openWarningModal(
        'Название таблицы должно содержать от 2 до 250 символов'
      )

      return false
    }

    return true
  }

  return {
    search,
    currentTable,
    loadTable,
    saveTable
  }
})
