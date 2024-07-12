<template>
  <div class="delete-account">
    <div class="delete-account__header">
      <h3 class="delete-account__header__title">Удаление аккаунта</h3>
    </div>
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
          alignment="center"
          @click="onDeleteAccount"
        >
          Удалить аккаунт
        </common-button>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <sure-modal
      v-model:visible="modalVisible"
      @confirm="$emit('delete-account')"
    >
      <template #title>
        <h2>Вы уверены, что хотите удалить свой аккаунт?</h2>
      </template>
      <template #text>
        <p>
          Все ваши данные будут удалены без возможности восстановления, включая
          все работы и всю статистику
        </p>
      </template>
    </sure-modal>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Emits {
  (e: 'delete-account'): void
}

defineEmits<Emits>()

const modalVisible = ref(false)

function onDeleteAccount() {
  modalVisible.value = true
}
</script>

<style lang="sass" scoped>
.delete-account
  &__header
    &__title
      text-align: center

  &__body
    &__warning
      text-align: center
      margin-bottom: 1em
      font-size: 0.8em

    &__button
      text-align: center
</style>
