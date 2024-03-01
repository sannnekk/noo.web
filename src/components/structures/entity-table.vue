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
      <tbody v-auto-animate>
        <tr
          v-if="!isLoading"
          v-for="(object, index) in data"
          :key="object.id"
        >
          <td
            v-for="col in cols"
            :key="col.title"
            :class="`col-type-${col.type}`"
          >
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
                  :to="unfunction(col, object, 'linkTo')"
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
                  :name="object[key]"
                  v-for="key in col.keys"
                />
              </span>
              <span v-else-if="col.type === 'avatar'">
                <user-avatar
                  :src="object[col.keys[0]]"
                  :name="object[col.keys[1]]"
                />
              </span>
              <span v-else>-</span>
            </span>
          </td>
          <td v-if="editable || removeable">
            <!-- TODO: actions -->
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
    <p
      v-else-if="!data || !data.length"
      class="entity-table__empty-text"
    >
      Нет данных
    </p>
  </div>
</template>

<script setup lang="ts">
import { useDate } from '@/composables/useDate'

interface Props {
  cols: {
    title: string
    value?: string | ((row: any) => string)
    keys: string[]
    join?: string
    width?: string
    style?: ('bold' | 'italic' | 'centered' | 'secondary')[]
    type: 'text' | 'tag' | 'link' | 'icon' | 'date' | 'avatar' | 'iterator'
    linkTo?: string | Function
    design?:
      | 'primary'
      | 'secondary'
      | 'success'
      | 'warning'
      | 'danger'
      | 'telegram'
    tagFunction?: (
      key: string,
      value: string | number | Date
    ) => {
      text: string
      type: 'success' | 'warning' | 'danger' | 'info'
    }
    if?: (row: any) => boolean
  }[]
  data: ({ id: string } & Record<string, string | number | Date>)[]
  dateConfig?: Parameters<typeof useDate>[1]
  removeable?: boolean
  editable?: boolean
  isLoading?: boolean
}

interface Emits {
  (e: 'remove', id: string): void
  (e: 'edit', id: string): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

function ifFunctionThenNotNullable(
  value: Props['cols'][0]['value'],
  row: any
): boolean {
  return value instanceof Function ? !!value.call(undefined, row) : true
}

function unfunction(
  col: Props['cols'][0],
  row: any,
  key: keyof Props['cols'][0] = 'value'
): Props['cols'][0][keyof Props['cols'][0]] {
  if (getValueByKey(col, key) instanceof Function) {
    return (getValueByKey(col, key) as Function).call(undefined, row)
  }

  return getValueByKey(col, key) || '-'
}

function getValueByKey(object: Record<string, any>, key: string): any {
  const keys = key.split('.')
  let value = object

  for (const key of keys) {
    if (!value) return '-'

    value = value[key]
  }

  return value
}

function getTextCol(object: Record<string, any>, col: Props['cols'][0]) {
  if (col.value instanceof Function) return unfunction(col, object)

  const keys = col.keys
  const join = col.join || '<br>'

  return keys
    .map((key) => getValueByKey(object, key) || '-')
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

  return keys
    .map((key) =>
      getValueByKey(object, key)
        ? useDate(getValueByKey(object, key), {
            precision: 'day'
          }).toBeautiful()
        : '-'
    )
    .join(join)
}
</script>

<style lang="sass">
.entity-table__style-bold
  font-weight: 600

.entity-table__style-italic
  font-style: italic

.entity-table__style-centered
  text-align: center

.entity-table__style-secondary
  color: var(--text-light)
  font-size: 0.8em
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
    margin: 8em 0

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

      td
        padding: 0.5rem

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
