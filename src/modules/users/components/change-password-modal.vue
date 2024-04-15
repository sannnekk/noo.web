<template>
  <sure-modal
    @confirm="onConfirm"
    v-model:visible="visibilityModel"
  >
    <template #title>
      <h3>
        Поменять пароль пользователю {{ user.name }} ({{ user.username }})
      </h3>
    </template>
    <template #text>
      <div class="input-group">
        <form-input
          type="password"
          v-model="data.newPassword"
          label="Новый пароль:"
        />
      </div>
      <div class="input-group">
        <form-input
          type="password"
          v-model="data.repeatPassword"
          label="Повторите новый пароль:"
        />
      </div>
      <password-criteria
        :password="data.newPassword"
        v-model="data.passwordIsStrong"
      />
      <br />
      <error-block v-if="data.error">{{ data.error }}</error-block>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { User } from '@/core/data/entities/User'
import { computed, reactive } from 'vue'

interface Props {
  user: User
  visible: boolean
}

interface Emits {
  (event: 'confirm', newPassword: string): void
  (event: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const data = reactive({
  newPassword: '',
  repeatPassword: '',
  error: '',
  passwordIsStrong: false
})

const visibilityModel = computed({
  get: () => props.visible,
  set: (value: boolean) => {
    if (!value) {
      data.newPassword = ''
      data.repeatPassword = ''
      data.error = ''
    }
    emits('update:visible', value)
  }
})

function onConfirm() {
  Core.Services.UI.setLoading(true)

  if (data.newPassword !== data.repeatPassword) {
    setTimeout(() => {
      Core.Services.UI.setLoading(false)
      visibilityModel.value = true
      data.error = 'Пароли не совпадают'
    }, 500)
    return
  }

  if (!data.passwordIsStrong) {
    setTimeout(() => {
      Core.Services.UI.setLoading(false)
      visibilityModel.value = true
      data.error = 'Пароль не удовлетворяет требованиям'
    }, 500)
    return
  }

  emits('confirm', data.newPassword)
  visibilityModel.value = false
}
</script>

<style scoped></style>
