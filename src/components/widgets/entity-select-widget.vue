<template>
  <div class="material-select-widget">
    <select-input
      :options="options"
      :label="label"
      v-model="model"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  modelValue: undefined | string | Object
  expect: 'id' | 'entity'
  nullable?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: undefined | string | Object): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const options = computed(() => {
  let options: {
    label: string
    value?: string
  }[] = [
    {
      label: '3.12 Черви. Теор день',
      value: '1'
    },
    {
      label: 'Option 2',
      value: '2'
    }
  ]

  if (props.nullable) {
    options = [
      {
        label: 'Не выбрано',
        value: undefined
      },
      ...options
    ]
  }

  if (props.expect === 'entity') {
    // TODO: load entities instead of ids
  }

  return options
})

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<style scoped lang="sass"></style>
