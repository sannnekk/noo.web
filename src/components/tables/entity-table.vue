<template>
  <table class="entity-table">
    <thead>
      <tr>
        <th
          v-for="(col, index) in cols"
          :key="index"
        >
          {{ col.title }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="object in data"
        :key="object.id"
      >
        <td
          v-for="col in cols"
          :key="col.title"
          :class="`col-style-${col.style} col-type-${col.type}`"
        >
          <span
            v-if="col.type === 'text'"
            v-html="getTextCol(object, col)"
          ></span>
          <span
            v-else-if="col.type === 'link'"
            v-for="(key, index) in col.keys"
            :key="key"
          >
            <common-button
              :design="index === 0 ? 'primary' : 'secondary'"
              alignment="center"
              :to="col.linkTo!"
            >
              {{ object[key] }}
            </common-button>
          </span>
          <span
            v-else-if="col.type === 'tag'"
            v-for="(key, index) in col.keys"
            :key="index"
          >
            <status-tag :type="col.tagFunction!(key, object[key]).type">
              {{ col.tagFunction!(key, object[key]).text }}
            </status-tag>
            <span v-html="col.join"></span>
          </span>
          <span
            v-else-if="col.type === 'date'"
            v-html="getDateCol(object, col)"
          ></span>
          <span
            v-else-if="col.type === 'icon'"
            v-for="key in col.keys"
          >
            <inline-icon :name="object[key]" />
          </span>
          <span v-else>-</span>
        </td>
        <td v-if="editable || removeable">
          <!-- TODO: actions -->
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { useDate } from '@/composables/useDate'

interface Props {
  cols: {
    title: string
    keys: string[]
    join?: string
    width?: string
    style?: ('bold' | 'italic' | 'centered')[]
    type: 'text' | 'tag' | 'link' | 'icon' | 'date'
    linkTo?: string
    tagFunction?: (
      key: string,
      value: string | number | Date
    ) => {
      text: string
      type: 'success' | 'warning' | 'danger' | 'info'
    }
  }[]
  data: ({ id: string } & Record<string, string | number | Date>)[]
  dateConfig?: Parameters<typeof useDate>[1]
  removeable?: boolean
  editable?: boolean
}

interface Emits {
  (e: 'remove', id: string): void
  (e: 'edit', id: string): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

function getTextCol(object: Record<string, any>, col: Props['cols'][0]) {
  const keys = col.keys
  const join = col.join || '<br>'

  return keys.map((key) => object[key] || '-').join(join)
}

function getDateCol(object: Record<string, any>, col: Props['cols'][0]) {
  const keys = col.keys
  const join = col.join || '<br>'

  return keys
    .map((key) => useDate(object[key], { precision: 'day' }).toBeautiful())
    .join(join)
}
</script>

<style scoped lang="sass">
.entity-table
  border-collapse: collapse

  thead
    tr
      th
        text-align: left
        font-weight: normal
        color: var(--text-light)
        padding: 0.5rem
        vertical-align: top
        min-width: 20%

  tbody
    tr
      border-top: 1px solid var(--border-color)

      td
        padding: 0.5rem

        &.col-style-bold
          font-weight: 500

        &.col-style-italic
          font-style: italic

        &.col-style-centered
          text-align: center

        &.col-type-text
          white-space: pre-wrap

        &.col-type-link
          font-size: 0.8em

        &.col-type-icon
          vertical-align: middle
          font-size: 1.7em

          span
            width: 1em
            height: 1em
            display: block
</style>
