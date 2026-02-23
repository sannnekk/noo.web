<template>
  <div
    class="actions-with-selected"
    v-auto-animate
  >
    <div
      class="actions-with-selected__inner"
      v-if="
        selectedAssignedWorks.length &&
        Core.Context.roleIs(['mentor', 'student'])
      "
    >
      <p class="actions-with-selected__label">
        Выбрано: {{ selectedAssignedWorks.length }}
      </p>
      <div class="actions-with-selected__actions">
        <common-button
          design="danger"
          alignment="stretch"
          @click="deleteWorkModalVisible = true"
        >
          Удалить
        </common-button>
        <common-button
          design="warning"
          alignment="stretch"
          @click="archiveWorksModalVisible = true"
        >
          Архивировать
        </common-button>
        <common-button
          v-if="Core.Context.roleIs(['mentor'])"
          design="secondary"
          alignment="stretch"
          @click="sendToRevisionModalVisible = true"
        >
          Отправить на дорешивание
        </common-button>
        <common-button
          v-if="Core.Context.roleIs(['mentor'])"
          design="secondary"
          alignment="stretch"
          @click="transferAssignedWorkModalVisible = true"
        >
          Передать другому куратору
        </common-button>
      </div>
    </div>
  </div>
  <transfer-assigned-work-modal
    :assigned-works="selectedAssignedWorks"
    v-model:visible="transferAssignedWorkModalVisible"
  />
  <archive-works-modal
    :assigned-works="selectedAssignedWorks"
    v-model:visible="archiveWorksModalVisible"
  />
  <sure-modal
    v-model:visible="deleteWorkModalVisible"
    @confirm="$emit('delete', selectedAssignedWorks)"
  >
    <template #title> Удаление работ </template>
    <template #text>
      Вы уверены, что хотите удалить выбранные работы?
    </template>
  </sure-modal>
  <sure-modal
    v-model:visible="sendToRevisionModalVisible"
    @confirm="$emit('send-to-revision', selectedAssignedWorks)"
  >
    <template #title> Отправка на дорешивание </template>
    <template #text>
      Вы уверены, что хотите отправить выбранные работы обратно ученикам на
      дорешивание?
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import { ref } from 'vue'
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import transferAssignedWorkModal from './transfer-assigned-work-modal.vue'
import archiveWorksModal from './archive-works-modal.vue'

interface Props {
  selectedAssignedWorks: AssignedWork[]
}

interface Emits {
  (event: 'delete', assignedWorks: AssignedWork[]): void
  (event: 'send-to-revision', assignedWorks: AssignedWork[]): void
}

defineProps<Props>()
defineEmits<Emits>()

const transferAssignedWorkModalVisible = ref(false)
const archiveWorksModalVisible = ref(false)
const deleteWorkModalVisible = ref(false)
const sendToRevisionModalVisible = ref(false)
</script>

<style lang="sass" scoped>
.actions-with-selected
  &__inner
    padding: 1em
    display: flex
    gap: 3em
    justify-content: flex-end
    align-items: center

    @media (max-width: 768px)
      flex-direction: column
      gap: 1em

  &__label
    margin: 0

  &__actions
    display: flex
    gap: 0.3em
    font-size: 0.7em

    @media (max-width: 768px)
      flex-wrap: wrap
      gap: 1em
</style>
