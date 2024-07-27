<template>
  <sure-modal
    v-model:visible="visibilityModel"
    @confirm="assignMentor()"
  >
    <template #title>
      <h3>Выберите куратора</h3>
    </template>
    <template #text>
      <p
        class="assign-mentor-modal__current-mentor"
        v-if="props.currentMentor"
      >
        Сейчас куратор: {{ props.currentMentor.name }}
      </p>
      <div class="assign-mentor-modal__search">
        <search-field
          v-model="mentorSearch.pagination.value.search"
          :is-loading="mentorSearch.isListLoading.value"
        />
      </div>
      <div class="assign-mentor-modal__list">
        <check-list
          :items="mentorSearch.results.value"
          item-label-key="name"
          item-key="id"
          v-model="selectedMentorId"
        />
      </div>
      <div class="assign-mentor-modal__pagination">
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

<script lang="ts" setup>
import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { User } from '@/core/data/entities/User'
import { computed, ref } from 'vue'

interface Props {
  currentMentor: User | null
  userId?: string
  visible: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'confirmed', value: User | null): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const uiService = Core.Services.UI
const userService = Core.Services.User

const visibilityModel = computed({
  get: () => props.visible,
  set: (value) => emits('update:visible', value)
})

const selectedMentorId = ref(
  props.currentMentor ? [props.currentMentor.id] : []
)
const selectedMentor = computed(() => {
  return mentorSearch.results.value.find(
    (mentor: User) => mentor.id === selectedMentorId.value?.at(0)
  )
})

/**
 * Mentors search
 */
const mentorSearch = useSearch(fetchMentors)

/**
 * Fetch mentors
 */
async function fetchMentors(pagination: Pagination) {
  if (Core.Context.roleIs(['student'])) {
    return
  }

  try {
    return await userService.getMentors(pagination)
  } catch (error: any) {
    uiService.openErrorModal(
      'Произошла ошибка при получении списка кураторов',
      error.message
    )
  }
}

/**
 * Assign mentor to user
 */
async function assignMentor() {
  if (!selectedMentorId.value || !props.userId) {
    return
  }

  uiService.setLoading(true)

  try {
    await userService.assignMentor(props.userId, selectedMentorId.value as any)
    uiService.openSuccessModal('Куратор успешно назначен')

    emits('confirmed', selectedMentor.value || null)
  } catch (error: any) {
    uiService.openErrorModal(
      'Произошла ошибка при назначении куратора',
      error.message
    )
  } finally {
    uiService.setLoading(false)
    visibilityModel.value = false
  }
}
</script>

<style lang="sass" scoped>
.assign-mentor-modal
  &__current-mentor
    margin-bottom: 1em
    color: var(--text-light)

  &__search
    margin-bottom: 1em

  &__list
    margin-bottom: 1em

  &__pagination
    margin-bottom: 1em
</style>
