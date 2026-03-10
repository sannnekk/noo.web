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
      <work-select
        label="Выберите работу для слияния"
        v-model="secondWork"
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
import { watch, ref } from 'vue'

interface Emits {
  (e: 'merge'): void
}

const emits = defineEmits<Emits>()

const workId2Model = defineModel<string | null>({
  default: null,
  required: true
})

const visibilityModel = defineModel('visible', {
  default: false,
  required: true
})

const secondWork = ref<Work | null>(null)

watch(secondWork, () => {
  workId2Model.value = secondWork.value?.id ?? null
})

function onConfirm() {
  if (!workId2Model.value) {
    return
  }

  visibilityModel.value = false
  emits('merge')
}
</script>
