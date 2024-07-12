<template>
  <div class="entity-table-container">
    <table class="entity-table">
      <thead>
        <tr>
          <th
            :class="`col-type-${col.type}`"
            v-for="(col, index) in cols"
            :key="index"
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
          v-for="(object, index) in data"
          :key="object.id"
        >
          <td
            v-for="(col, colIndex) in cols"
            :key="col.title"
            :class="`col-type-${col.type}`"
          >
            <b
              class="edit-checkbox"
              :class="{ 'edit-checkbox--checked': checkList[object.id] }"
              v-if="editable && colIndex === 0"
              @click="checkList[object.id] = !checkList[object.id]"
            ></b>
            <span v-if="(col.if || (() => true))(object)">
              <span v-if="col.type === 'iterator'">
                {{ index + 1 }}
              </span>
              <span
                v-else-if="col.type === 'text'"
                v-html="getTextCol(object, col)"
              ></span>
              <span v-else-if="col.type === 'link'">
                <common-button
                  v-if="
                    col.value && ifFunctionThenNotNullable(col.value, object)
                  "
                  :to="
                    col.linkTo ? unfunction(col, object, 'linkTo') : undefined
                  "
                  @click="unfunction(col, object, 'action')"
                  :design="col.design || 'primary'"
                  alignment="center"
                >
                  {{ unfunction(col, object) }}
                </common-button>
                <common-button
                  v-else-if="
                    col.keys &&
                    col.keys.length &&
                    col.keys.some((key) => object[key])
                  "
                  alignment="center"
                  :design="col.design || 'primary'"
                  :to="unfunction(col, object, 'linkTo')"
                  v-for="key in col.keys"
                  :key="key"
                >
                  {{ object[key] }}
                </common-button>
              </span>
              <span
                v-else-if="col.type === 'tag'"
                v-for="(key, index) in col.keys"
                :key="index"
              >
                <status-tag
                  class="status-tag"
                  :type="col.tagFunction!(key, object[key]).type"
                >
                  {{ col.tagFunction!(key, object[key]).text }}
                </status-tag>
                <span
                  v-if="col.join"
                  v-html="col.join"
                ></span>
              </span>
              <span
                v-else-if="col.type === 'date'"
                v-html="getDateCol(object, col)"
              ></span>
              <span v-else-if="col.type === 'icon'">
                <inline-icon
                  v-if="col.value"
                  :name="unfunction(col, object)"
                />
                <inline-icon
                  v-else
                  :name="object[key] as IconName"
                  v-for="key in col.keys"
                  :key="key"
                />
              </span>
              <span v-else-if="col.type === 'avatar'">
                <user-avatar
                  :src="object[col.keys![0]] as string"
                  :name="object[col.keys![1]] as string"
                />
              </span>
              <span v-else>-</span>
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
      Контент не найден
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDate } from '@/composables/useDate'
import { ref, watch } from 'vue'
import type { IconName } from '../decorations/inline-icon.vue'
import type { MenuItem } from '../widgets/more-widget.vue'

export interface ColType {
  title: string
  type: 'text' | 'tag' | 'link' | 'icon' | 'date' | 'avatar' | 'iterator'
  keys?: string[]
  value?: string | ((row: any) => string)
  join?: string
  width?: string
  style?: ('bold' | 'italic' | 'centered' | 'secondary')[]
  linkTo?: string | Function
  action?: (row: any) => void
  if?: (row: any) => boolean
  design?: 'primary' | 'secondary' | 'warning' | 'danger' | 'telegram'
  tagFunction?: (
    key: string,
    value: string | number | Date
  ) => {
    text: string
    type: 'success' | 'warning' | 'danger' | 'info'
  }
}

interface Props {
  cols: ColType[]
  data: ({ id: string } & Record<string, string | number | Date>)[]
  dateConfig?: Parameters<typeof useDate>[1]
  editable?: boolean
  isLoading?: boolean
  actions?: (row: any) => MenuItem[]
}

interface Emits {
  (e: 'remove', id: string): void
  (e: 'edit', id: string): void
  (e: 'select', ids: string[]): void
}

defineProps<Props>()
const emits = defineEmits<Emits>()

function ifFunctionThenNotNullable(value: ColType['value'], row: any): boolean {
  return value instanceof Function ? !!value.call(undefined, row) : true
}

function unfunction(col: ColType, row: any, key: keyof ColType = 'value'): any {
  if (getValueByKey(col, key) instanceof Function) {
    return (getValueByKey(col, key) as Function).call(undefined, row)
  }

  return getValueByKey(col, key)
}

function getValueByKey(object: Record<string, any>, key: string): any {
  const keys = key.split('.')
  let value = object

  for (const key of keys) {
    if (typeof value === 'undefined' || value === null) return '-'
    if (key === 'each') {
      value = value
        .map((v: any) => v[keys[keys.indexOf('each') + 1]])
        .join(', ')
      break
    }

    value = value[key]
  }

  return typeof value === 'undefined' || value === null ? '-' : value
}

function getTextCol(object: Record<string, any>, col: ColType) {
  if (col.value instanceof Function) return unfunction(col, object)

  const keys = col.keys
  const join = col.join || '<br>'

  return keys!
    .map((key) => getValueByKey(object, key))
    .map(
      (value, index) =>
        `<span class='entity-table__style-${
          col.style && col.style.length ? col.style[index] : 'default'
        }'>${value}</span>`
    )
    .join(join)
}

function getDateCol(object: Record<string, any>, col: Props['cols'][0]) {
  if (col.value instanceof Function) return unfunction(col, object)

  const keys = col.keys
  const join = col.join || '<br>'

  return keys!
    .map((key) =>
      getValueByKey(object, key) !== '-'
        ? useDate(getValueByKey(object, key), {
            precision: 'day'
          }).toBeautiful()
        : '-'
    )
    .join(join)
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
</script>

<style lang="sass">
.entity-table
  &__style-bold
    font-weight: 600

  &__style-italic
    font-style: italic

  &__style-centered
    text-align: center

  &__style-secondary
    color: var(--text-light)
    font-size: 0.8em

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

        .status-tag
          margin: 0.5em 0

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
          font-size: 3em
          width: 1em
</style>
