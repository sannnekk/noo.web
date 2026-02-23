<template>
  <div class="entity-table-container">
    <table class="entity-table">
      <thead>
        <tr>
          <th></th>
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
      <tbody v-if="!isLoading">
        <tr
          v-for="(object, rowIndex) in treeDataToShow"
          @click="onToggleCollapse(object)"
          :key="object.id"
        >
          <td
            class="coll-expander"
            :class="`nesting-level-${object.nestingLevel}`"
          >
            <span v-if="children(object) && children(object).length">
              <b>&#8250;</b>
            </span>
          </td>
          <td
            v-for="(col, colIndex) in cols"
            :key="colIndex"
            :class="[`col-type-${col.type}`, { 'is-link': col.linkTo }]"
          >
            <span
              class="table-cell"
              :class="colIndex === 0 ? 'table-cell--first' : ''"
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
      v-else-if="!treeData || !treeData.length"
      class="entity-table__empty-text"
    >
      <nothing-found-image class="entity-table__empty-text__img" />
      <b>Контент не найден.</b> <br />
      Попробуйте изменить параметры поиска или перезагрузить страницу.
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  onAction,
  getCellComponent,
  getValue,
  treeToCollapsable
} from './helpers'
import { computed, reactive, ref, watch } from 'vue'
import type { Collapsable } from './types'
import type { EntityTableProps } from './entity-table.vue'

export interface TreeEntityTableProps extends EntityTableProps {
  children: (row: any) => any[]
}

const props = defineProps<TreeEntityTableProps>()

const treeDataToShow = computed(() => {
  return treeData.value.filter((item: any) => !item.collapsed)
})

const treeData = ref<Collapsable>(treeToCollapsable(props.data, props.children))

watch(
  () => props.data,
  () => {
    treeData.value = treeToCollapsable(props.data, props.children)
  }
)

const keys = reactive<string[]>(props.cols.map(() => Math.random().toString()))

function onToggleCollapse(object: any) {
  const isCollapsed = treeData.value.find(
    (item: any) => item.parentId === object.id
  )?.collapsed

  treeData.value = treeData.value.map((item: any) => {
    if (isCollapsed) {
      if (item.parentId === object.id) {
        return { ...item, collapsed: false }
      }
    } else {
      if (item.parentIdChain?.includes(object.id)) {
        return { ...item, collapsed: true }
      }
    }

    return item
  })
}
</script>

<style scoped lang="sass" src="./styles.sass" />

<style scoped lang="sass">
.coll-expander
	width: 2em
	text-align: center
	cursor: pointer
	user-select: none

	&.nesting-level-1 + td
		padding-left: 1.5em

	&.nesting-level-2 + td
		padding-left: 2.5em

	&.nesting-level-3 + td
		padding-left: 3.5em
</style>
