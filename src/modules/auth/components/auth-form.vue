<template>
  <div class="auth-form">
    <div class="auth-form__group">
      <text-input
        v-model="model.username"
        placeholder="Логин"
        @enter-press="onSubmit()"
      />
    </div>
    <div class="auth-form__group">
      <text-input
        v-model="model.password"
        placeholder="Пароль"
        @enter-press="onSubmit()"
        password
      />
    </div>
    <div class="auth-form__group">
      <common-button
        contrast
        alignment="center"
        :loading="loading"
        @click="onSubmit()"
      >
        Войти
      </common-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

interface Props {
  modelValue: {
    username: string
    password: string
  }
}

interface Emits {
  (e: 'update:modelValue', value: Props['modelValue']): void
  (e: 'submit'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
})

const loading = ref(false)

function onSubmit() {
  emits('submit')
  loading.value = true

  setTimeout(() => (loading.value = false), 2000)
}
</script>

<style lang="sass" scoped>
.auth-form
  &__group
    margin-bottom: 1em
</style>
