<template>
  <sure-modal
    v-model:visible="openedModel"
    @confirm="onConfirm()"
  >
    <template #title>
      <h3>Изменить куратора у работы "{{ assignedWork.work?.name }}"</h3>
    </template>
    <template #text>
      <div class="change-mentor-modal__search">
        <search-field
          v-model="mentorSearch.pagination.value.search"
          :is-loading="mentorSearch.isListLoading.value"
        />
      </div>
      <div class="change-mentor-modal__list">
        <check-list
          :items="mentorSearch.results.value"
          item-label-key="name"
          item-key="id"
          v-model="mentorIdModel"
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
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import { computed } from 'vue'

interface Props {
  assignedWork: AssignedWork
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

async function onConfirm() {
  if (!mentorIdModel.value.at(0)) {
    return Core.Services.UI.openWarningModal('Куратор не выбран')
  }

  Core.Services.UI.setLoading(true)

  try {
    await Core.Services.AssignedWork.changeMentor(
      props.assignedWork.id,
      mentorIdModel.value.at(0)!
    )
  } catch (error: any) {
    Core.Services.UI.openErrorModal(
      'Произошла ошибка при изменении куратора',
      error.message
    )
  } finally {
    Core.Services.UI.setLoading(false)
  }

  emits('confirm')
}
</script>

<style scoped lang="sass">
.change-mentor-modal
  &__list
    margin-top: 1em
</style>
