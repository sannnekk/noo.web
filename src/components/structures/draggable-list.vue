<template>
  <draggable
    v-model="model"
    item-key="id"
    :handle="handle"
    :group="group"
    :class="$attrs.class"
  >
    <template #item="{ element }">
      <div><slot :item="element" /></div>
    </template>
  </draggable>
  <Teleport to="body">
    <sure-modal
      v-model:visible="beforeDragModalVisible"
      @confirm="onConfirm()"
      @cancel="onCancel()"
    >
      <template #title>
        <slot name="title">Подтвердите перемещение</slot>
      </template>
      <template #text>
        <slot name="text">
          Вы уверены, что хотите переместить этот элемент?
        </slot>
      </template>
    </sure-modal>
  </Teleport>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { computed, shallowRef } from 'vue'
import { deepCopy } from '@/core/utils/object'

interface Props {
  modelValue: ({
    id: string
  } & any)[]
  handle?: string
  group?: string
  promptBeforeDrag?: boolean
}

interface Emits {
  (event: 'update:modelValue', value: any[]): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (props.promptBeforeDrag) {
      beforeDragModalVisible.value = true
      tempValue.value = deepCopy(value, false)
      return
    }

    emits('update:modelValue', value)
  }
})

const beforeDragModalVisible = shallowRef(false)
const tempValue = shallowRef<any[]>([])

function onConfirm() {
  emits('update:modelValue', tempValue.value)
}

function onCancel() {
  tempValue.value = []
}
</script>
