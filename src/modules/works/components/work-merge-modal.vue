<template>
  <base-modal
    v-model:visible="visibilityModel"
    type="info"
    title="Слияние работ"
    :actions="[
      {
        label: 'Соединить работы в одну',
        design: 'primary',
        handler: onConfirm
      }
    ]"
  >
    <div class="work-merge-modal__content">
      <works-select
        label="Выберите работы для слияния"
        v-model="otherWorks"
      />
      <br />
      <info-block
        >Выбранные работы не будут изменены, но будет создана новая работа,
        которая будет слиянием двух выбранных</info-block
      >
      <br />
    </div>
  </base-modal>
</template>

<script lang="ts" setup>
import type { Work } from '@/core/data/entities/Work'
import { watch, ref } from 'vue'

interface Emits {
  (e: 'merge'): void
}

const emits = defineEmits<Emits>()

const workIdsModel = defineModel<string[]>({
  default: [],
  required: true
})

const visibilityModel = defineModel('visible', {
  default: false,
  required: true
})

const otherWorks = ref<Work[]>([])

watch(otherWorks, () => {
  workIdsModel.value = otherWorks.value.map((work) => work.id)
})

function onConfirm() {
  if (!workIdsModel.value.length) {
    return
  }

  visibilityModel.value = false
  emits('merge')
}
</script>
