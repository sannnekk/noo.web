<template>
  <div class="entity-table-container">
    <table class="entity-table">
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
            @click="onClick(col, object)"
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
                @action="onAction(col, object, colIndex)"
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
      <nothing-found-image class="entity-table__empty-text__img" />
      <b>Контент не найден.</b> <br />
      Попробуйте изменить параметры поиска или перезагрузить страницу.
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { MenuItem } from '../../widgets/more-widget.vue'
import { useRouter } from 'vue-router'

import entityTableAvatarCell from './entity-table-avatar-cell.vue'
import entityTableButtonCell from './entity-table-button-cell.vue'
import entityTableDateCell from './entity-table-date-cell.vue'
import entityTableIconCell from './entity-table-icon-cell.vue'
import entityTableIteratorCell from './entity-table-iterator-cell.vue'
import entityTableTextCell from './entity-table-text-cell.vue'
import entityTableSubjectCell from './entity-table-subject-cell.vue'
import entityTableImageCell from './entity-table-image-cell.vue'
import entityTableUserCell from './entity-table-user-cell.vue'

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

interface Props {
  cols: ColType[]
  data: ({ id: string } & object)[]
  editable?: boolean
  isLoading?: boolean
  actions?: (row: any) => MenuItem[]
}

interface Emits {
  (e: 'remove', id: string): void
  (e: 'edit', id: string): void
  (e: 'select', ids: string[]): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const router = useRouter()

const keys = reactive<string[]>(props.cols.map(() => Math.random().toString()))

function getValue(col: ColType, row: any, index: number): any[] {
  let result = null

  switch (col.type) {
    case 'icon':
    case 'date':
    case 'avatar':
    case 'text':
    case 'subject':
    case 'image':
    case 'user':
    case 'button':
      result = col.value?.(row)
      break
    case 'iterator':
      result = index + 1
      break
    default:
      result = null
      break
  }

  if (Array.isArray(result)) {
    result = result.map((value, i) => {
      return {
        value,
        joinType: i === result.length - 1 ? undefined : col.joinType
      }
    })

    return result
  }

  return [{ value: result }]
}

function getCellComponent(type: ColType['type']) {
  switch (type) {
    case 'text':
      return entityTableTextCell
    case 'icon':
      return entityTableIconCell
    case 'date':
      return entityTableDateCell
    case 'avatar':
      return entityTableAvatarCell
    case 'iterator':
      return entityTableIteratorCell
    case 'button':
      return entityTableButtonCell
    case 'subject':
      return entityTableSubjectCell
    case 'image':
      return entityTableImageCell
    case 'user':
      return entityTableUserCell
    default:
      return 'td'
  }
}

const checkList = ref<Record<string, boolean>>({})

watch(
  checkList,
  (newVal) => {
    const ids = Object.keys(newVal).filter((id) => newVal[id])

    emits('select', ids)
  },
  { deep: true }
)

function onClick(col: ColType, row: any) {
  if (col.linkTo) {
    if (typeof col.linkTo === 'function') {
      router.push(col.linkTo(row))
    } else {
      router.push(col.linkTo)
    }
  }
}

async function onAction(col: ColType, row: any, index: number) {
  if (col.action) {
    await col.action(row)
    keys[index] = Math.random().toString()
  }
}
</script>

<style lang="sass">
.entity-table
  td
    small
      color: var(--text-light)
      font-size: 0.8em
      white-space: nowrap
</style>

<style scoped lang="sass">
.entity-table-container
  overflow-x: auto
  margin: 1em 0

.entity-table
  width: 100%
  border-collapse: collapse

  @media screen and (max-width: 768px)
    font-size: 12px

  &__loading
    text-align: center
    padding: 8em 0

    &__icon
      font-size: 60px
      display: inline-block

  &__empty-text
    text-align: center
    color: var(--text-light)
    display: flex
    flex-direction: column
    align-items: center
    gap: 1em
    margin: 1em 0

    &__img
      width: min(90%, 500px)
      height: auto
      margin-bottom: 1em

  thead
    tr
      th
        text-align: left
        font-weight: normal
        color: var(--text-light)
        padding: 0.5rem
        vertical-align: top

        &.col-type-link
          text-align: center

  tbody
    tr
      border-top: 1px solid var(--border-color)

      &:hover
        td
          .edit-checkbox
            width: 15px

      td
        padding: 0.5rem
        position: relative

        &.is-link
          cursor: pointer
          //border-radius: var(--border-radius)

          &:hover
            background-color: var(--light-background-color)

        .edit-checkbox
          display: block
          position: absolute
          top: 0
          left: 0
          width: 0
          height: 100%
          background-color: var(--primary)
          transition: width 0.2s ease

          *
            display: none

          &--checked
            width: 8px
            background-color: var(--lila)

        &.col-type-text
          white-space: pre-wrap

        &.col-type-link
          font-size: 0.8em

        &.col-type-icon
          vertical-align: middle
          font-size: 1.7em
          width: 2em
          text-align: center

          span
            width: 1em
            height: 1em
            display: inline-block

        &.col-type-avatar
          font-size: 1em
          width: 1em
</style>
