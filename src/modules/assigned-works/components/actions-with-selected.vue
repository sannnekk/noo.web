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
          @click="archiveWorksModalVisible = true"
        >
          Архивировать
        </common-button>
        <common-button
          v-if="Core.Context.roleIs(['mentor'])"
          design="secondary"
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

defineProps<Props>()

const transferAssignedWorkModalVisible = ref(false)
const archiveWorksModalVisible = ref(false)
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
    font-size: 0.8em
</style>
