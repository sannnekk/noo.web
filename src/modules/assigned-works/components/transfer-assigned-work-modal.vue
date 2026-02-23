<template>
  <sure-modal
    v-model:visible="visibilityModel"
    @confirm="transferWorkStore.transferWorks(assignedWorks)"
  >
    <template #title>
      <h2>Передать работы</h2>
    </template>
    <template #text>
      <div class="transfer-assigned-work-modal__label">
        Выбрано работ: {{ assignedWorks.length }}
      </div>
      <div class="transfer-assigned-work-modal__select">
        <div class="transfer-assigned-work-modal__select__search">
          <search-field
            v-model="transferWorkStore.pagination.search"
            :is-loading="transferWorkStore.isListLoading"
          />
        </div>
        <div class="transfer-assigned-work-modal__select__list">
          <check-list
            v-model="transferWorkStore.selectedMentorId"
            :items="transferWorkStore.results"
            item-label-key="name,username"
            item-key="id"
          />
        </div>
        <div
          class="transfer-assigned-work-modal__select__pagination"
          v-if="
            transferWorkStore.pagination.page &&
            transferWorkStore.pagination.limit
          "
        >
          <list-pagination
            v-model:page="transferWorkStore.pagination.page"
            :total="transferWorkStore.resultsMeta.total"
            :limit="transferWorkStore.pagination.limit"
          />
        </div>
      </div>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import { useTransferWorkStore } from '../stores/transfer-work'
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import { computed } from 'vue'

interface Props {
  visible: boolean
  assignedWorks: AssignedWork[]
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const transferWorkStore = useTransferWorkStore()

const visibilityModel = computed({
  get: () => props.visible,
  set: (value: boolean) => emits('update:visible', value)
})
</script>

<style scoped lang="sass">
.transfer-assigned-work-modal
  &__select
    margin-top: 1em
    display: flex
    flex-direction: column
    gap: 1em
</style>
