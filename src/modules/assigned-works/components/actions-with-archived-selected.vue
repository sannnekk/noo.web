<template>
  <div
    class="actions-with-selected"
    v-auto-animate
  >
    <div
      class="actions-with-selected__inner"
      v-if="selectedAssignedWorks.length"
    >
      <p class="actions-with-selected__label">
        Выбрано: {{ selectedAssignedWorks.length }}
      </p>
      <div class="actions-with-selected__actions">
        <common-button
          design="danger"
          @click="unarchiveWorksModalVisible = true"
        >
          Разархивировать
        </common-button>
      </div>
    </div>
  </div>
  <unarchive-works-modal
    :assigned-works="selectedAssignedWorks"
    v-model:visible="unarchiveWorksModalVisible"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import unarchiveWorksModal from './unarchive-works-modal.vue'

interface Props {
  selectedAssignedWorks: AssignedWork[]
}

defineProps<Props>()

const unarchiveWorksModalVisible = ref(false)
</script>

<style lang="sass" scoped>
.actions-with-selected
  &__inner
    padding: 1em
    display: flex
    gap: 3em
    justify-content: flex-end
    align-items: center

  &__label
    margin: 0

  &__actions
    display: flex
    font-size: 0.7em
    gap: 0.3em

    @media (max-width: 1100px)
      flex-direction: column
      gap: 1em
</style>
