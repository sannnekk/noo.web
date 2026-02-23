<template>
  <sure-modal
    v-model:visible="visibilityModel"
    @confirm="onConfirm()"
  >
    <template #title>
      <h2>Смена почты</h2>
    </template>
    <template #text>
      <form-input
        v-model="newEmail"
        label="Новый email"
        type="email"
      />
      <br />
      <warning-block>
        <p class="hint">
          После смены почты Вы должны будете подтвердить новый адрес. На почту,
          введенную ниже, будет отправлено письмо с подтверждением. До
          подтверждения новой почты будет активна старая.
        </p>
      </warning-block>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  visible: boolean
}

interface Emits {
  (event: 'update:visible', value: boolean): void
  (event: 'confirm', newEmail: string): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const visibilityModel = computed({
  get: () => props.visible,
  set: (value) => emits('update:visible', value)
})

const newEmail = ref('')

function onConfirm() {
  emits('confirm', newEmail.value)
}
</script>

<style scoped lang="sass">
.hint
	font-size: 0.8em
</style>
