<template>
  <div class="delete-account">
    <div class="delete-account__body">
      <div class="delete-account__body__warning">
        <p>
          Все ваши данные будут удалены без возможности восстановления, включая
          все работы и всю статистику
        </p>
      </div>
      <div class="delete-account__body__button">
        <common-button
          design="danger"
          alignment="left"
          @click="onDeleteAccount"
        >
          Удалить аккаунт
        </common-button>
      </div>
    </div>
  </div>
  <sure-modal
    v-model:visible="modalVisible"
    @confirm="$emit('delete-account', password)"
  >
    <template #title>
      <h2>Вы уверены, что хотите удалить свой аккаунт?</h2>
    </template>
    <template #text>
      <p>
        Все ваши данные будут удалены без возможности восстановления, включая
        все работы и всю статистику
      </p>
      <form-input
        v-model="password"
        type="password"
        label="Введите ваш пароль для подтверждения"
      />
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Emits {
  (e: 'delete-account', password: string): void
}

defineEmits<Emits>()

const modalVisible = ref(false)
const password = ref('')

function onDeleteAccount() {
  modalVisible.value = true
}
</script>

<style lang="sass" scoped>
.delete-account
  &__body
    &__warning
      margin-bottom: 1em
      font-size: 0.8em
</style>
