<template>
  <div class="entity-table-container">
    <table
      class="entity-table"
      v-if="data && data.length"
    >
      <thead>
        <tr>
          <th
            :class="`col-type-${col.type}`"
            v-for="(col, index) in cols"
            :key="index"
            :style="{ width: col.width }"
          >
            {{ col.title }}
          </th>
        </tr>
      </thead>
      <tbody
        v-auto-animate
        v-if="!isLoading"
      >
        <tr
          v-for="(object, rowIndex) in data"
          :key="object.id"
        >
          <td
            v-for="(col, colIndex) in cols"
            :key="colIndex"
            :class="[`col-type-${col.type}`, { 'is-link': col.linkTo }]"
            @click="onCellClick(col, object)"
          >
            <b
              class="edit-checkbox"
              :class="{ 'edit-checkbox--checked': checkList[object.id] }"
              v-if="editable && colIndex === 0"
              @click="checkList[object.id] = !checkList[object.id]"
            ></b>
            <span
              class="table-cell"
              v-for="(value, cellIndex) in getValue(col, object, rowIndex)"
              :key="keys[cellIndex]"
            >
              <component
                :is="getCellComponent(col.type)"
                :value="value.value"
                :alignment="col.alignment"
                :design="
                  typeof col.design === 'function'
                    ? col.design(object)
                    : col.design
                "
                :is-loading="col.isLoading?.(object)"
                :link-to="
                  typeof col.linkTo === 'function'
                    ? col.linkTo(object)
                    : col.linkTo
                "
                @action="onAction(col, object, colIndex, keys)"
              />
              <br v-if="value.joinType === 'br'" />
              <span v-else-if="value.joinType === '/'">/</span>
              <span v-else-if="value.joinType === ','">,</span>
            </span>
          </td>
          <td
            class="entity-table__actions"
            v-if="actions"
          >
            <more-widget :items="actions(object)" />
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="isLoading"
      class="entity-table__loading"
    >
      <div class="entity-table__loading__icon">
        <loader-icon contrast />
      </div>
    </div>
    <div
      v-else-if="!data || !data.length"
      class="entity-table__empty-text"
    >
      <div
        class="entity-table__empty-text__custom"
        v-if="emptyText"
      >
        {{ emptyText }}
      </div>
      <div
        class="entity-table__empty-text__default"
        v-else
      >
        <nothing-found-image class="entity-table__empty-text__img" />
        <b>Контент не найден.</b> <br />
        Попробуйте изменить параметры поиска или перезагрузить страницу.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { MenuItem } from '../../widgets/more-widget.vue'
import { onAction, getCellComponent, getValue } from './helpers'
import { useRouter } from 'vue-router'

type ButtonType = 'primary' | 'secondary' | 'warning' | 'danger' | 'telegram'

export interface ColType {
  title: string
  type:
    | 'icon'
    | 'date'
    | 'avatar'
    | 'text'
    | 'iterator'
    | 'button'
    | 'image'
    | 'subject'
    | 'user'
  value?: (row: any) => any | any[]
  linkTo?: string | ((row: any) => string)
  width?: string
  joinType?: 'br' | '/' | ','

  // for button type
  action?: (row: any) => void
  design?: ButtonType | ((row: any) => ButtonType)
  isLoading?: (row: any) => boolean
  alignment?: 'left' | 'center' | 'right' | 'stretch'
}

export interface EntityTableProps {
  cols: ColType[]
  data: ({ id: string } & object)[]
  isLoading?: boolean
  actions?: (row: any) => MenuItem[]
}

interface Props extends EntityTableProps {
  editable?: boolean
  emptyText?: string
}

interface Emits {
  (e: 'select', ids: string[]): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const router = useRouter()

const keys = reactive<string[]>(props.cols.map(() => Math.random().toString()))

const checkList = ref<Record<string, boolean>>({})

watch(
  checkList,
  (newVal) => {
    const ids = Object.keys(newVal).filter((id) => newVal[id])

    emits('select', ids)
  },
  { deep: true }
)

function onCellClick(col: ColType, row: any) {
  if (col.linkTo) {
    if (typeof col.linkTo === 'function') {
      router.push(col.linkTo(row))
    } else {
      router.push(col.linkTo)
    }
  }
}
</script>

<style scoped lang="sass" src="./styles.sass" />
