<template>
  <ul class="check-list">
    <li
      class="check-list__item"
      v-for="(item, index) in items"
      :key="(item[itemKey] as string)"
    >
      <form-checkbox
        :label="getLabel(item)"
        :model-value="model[index]"
        :readonly="readonly"
        @update:modelValue="onSelect(item[itemKey] as string)"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  items: Record<string, any>[]
  itemLabelKey?: string
  itemKey?: string
  multiple?: boolean
  modelValue: string[]
  readonly?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  itemLabelKey: 'name',
  itemKey: 'id'
})
const emits = defineEmits<Emits>()

const model = computed(() =>
  props.items.map((item) => props.modelValue.includes(item[props.itemKey]))
)

function onSelect(key: string) {
  let value = [...props.modelValue]

  if (props.multiple) {
    const index = value.indexOf(key)
    if (index === -1) {
      value.push(key)
    } else {
      value.splice(index, 1)
    }

    return emits('update:modelValue', value)
  }

  value = [key]
  emits('update:modelValue', value)
}

function getLabel(item: Record<string, any>) {
  return props.itemLabelKey
    .split(',')
    .map((key) => item[key] || '—')
    .join(', ')
}
</script>

<style scoped lang="sass">
.check-list
  list-style: none
  padding: 0
  margin: 0

  &__item
    margin-bottom: 1rem
</style>
