<template>
  <div class="profile-credentials__delete-account">
    <common-button
      design="danger"
      alignment="stretch"
      @click="onDeleteAccount"
    >
      Удалить аккаунт
    </common-button>
  </div>
  <Teleport to="body">
    <sure-modal
      v-model:visible="modalVisible"
      @confirm="$emit('delete-account')"
    >
      <template #title>
        <h2 style="margin: 0">Вы уверены, что хотите удалить свой аккаунт?</h2>
      </template>
      <template #text>
        <p>
          Все ваши данные будут удалены без возможности восстановления, включая
          все работы и всю статистику
        </p>
        <br />
      </template>
    </sure-modal>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Emits {
  (e: 'delete-account'): void
}

const emits = defineEmits<Emits>()

const modalVisible = ref(false)

function onDeleteAccount() {
  modalVisible.value = true
}
</script>
