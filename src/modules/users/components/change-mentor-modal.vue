<template>
  <sure-modal
    v-model:visible="openedModel"
    @confirm="onConfirm()"
    :actions-disabled="progress === 0"
    stay-open
  >
    <template #title>
      <h3 v-if="assignedWorks.length === 1">
        Изменить куратора у работы "{{ assignedWorks[0].work?.name }}"
      </h3>
      <h3 v-else>Изменить куратора у {{ assignedWorks.length }} работ</h3>
    </template>
    <template #text>
      <div class="change-mentor-modal__search">
        <search-field
          v-model="mentorSearch.pagination.value.search"
          :is-loading="mentorSearch.isListLoading.value || progress !== 0"
        />
      </div>
      <div class="change-mentor-modal__list">
        <check-list
          :items="mentorSearch.results.value"
          item-label-key="name"
          item-key="id"
          v-model="mentorIdModel"
          :readonly="progress !== 0"
        />
        <list-pagination
          v-if="
            mentorSearch.pagination.value.page &&
            mentorSearch.pagination.value.limit
          "
          v-model:page="mentorSearch.pagination.value.page"
          :total="mentorSearch.resultsMeta.value.total"
          :limit="mentorSearch.pagination.value.limit"
        />
      </div>
      <div
        class="change-mentor-modal__progress"
        v-if="progress != 0"
      >
        <p>Пожалуйста, не закрывайте это окно</p>
        <progress-bar :value="progress" />
      </div>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import { computed, ref } from 'vue'

interface Props {
  assignedWorks: AssignedWork[]
  opened?: boolean
  mentorId: string | null
}

interface Emits {
  (event: 'update:opened', value: boolean): void
  (event: 'update:mentorId', value: string | null): void
  (event: 'confirm'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const openedModel = computed({
  get: () => props.opened,
  set: (value: boolean) => emits('update:opened', value)
})

const mentorIdModel = computed({
  get: () => [props.mentorId],
  set: (value) => emits('update:mentorId', value[0])
})

const mentorSearch = useSearch(fetchMentors, {
  immediate: true
})

async function fetchMentors(pagination?: Pagination) {
  try {
    return await Core.Services.User.getMentors(pagination)
  } catch (error: any) {
    Core.Services.UI.openErrorModal(
      'Произошла ошибка при получении списка кураторов',
      error.message
    )
  }
}

const progress = ref(0)

async function onConfirm() {
  if (!mentorIdModel.value.at(0)) {
    return Core.Services.UI.openWarningModal('Куратор не выбран')
  }

  progress.value = 0.01

  try {
    for (const assignedWork of props.assignedWorks) {
      await Core.Services.AssignedWork.changeMentor(
        assignedWork.id,
        mentorIdModel.value.at(0)!
      )
      progress.value += 100 / props.assignedWorks.length
    }
  } catch (error: any) {
    Core.Services.UI.openErrorModal(
      'Произошла ошибка при изменении куратора',
      error.message
    )
  } finally {
    openedModel.value = false
    progress.value = 0
  }

  emits('confirm')
}
</script>

<style scoped lang="sass">
.change-mentor-modal
  &__list
    margin-top: 1em
</style>
