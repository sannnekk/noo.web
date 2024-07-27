<template>
  <div
    class="assigned-works-view"
    v-auto-animate
  >
    <div class="assigned-works-view__search">
      <search-field v-model="search.pagination.value.search" />
    </div>
    <div
      class="assigned-works-view__selection"
      v-if="selectedWorks.length"
    >
      <p class="assigned-works-view__selection__title">
        Выбрано работ: {{ selectedWorks.length }}
      </p>
      <div class="assigned-works-view__selection__actions">
        <common-button
          design="secondary"
          @click="openChangeMentorModal(selectedWorks)"
        >
          Поменять куратора
        </common-button>
      </div>
    </div>
    <div class="assigned-works-view__results">
      <entity-table
        :data="search.results.value"
        :cols="cols"
        :actions="actions"
        :is-loading="search.isListLoading.value"
        editable
        @select="onSelect($event)"
      />
    </div>
    <div
      class="assigned-works-view__pagination"
      v-if="
        search.pagination.value.page &&
        search.resultsMeta.value.total &&
        search.pagination.value.limit
      "
    >
      <list-pagination
        v-model:page="search.pagination.value.page"
        :total="search.resultsMeta.value.total"
        :limit="search.pagination.value.limit"
      />
    </div>
  </div>
  <change-mentor-modal
    v-model:opened="changeMentorModal.opened"
    v-model:mentorId="changeMentorModal.mentorId"
    :assigned-works="changeMentorModal.assignedWorks"
    @confirm="onMentorChanged()"
  />
</template>

<script setup lang="ts">
import ChangeMentorModal from './change-mentor-modal.vue'
import type { ColType } from '@/components/structures/entity-table/entity-table.vue'
import type { MenuItem } from '@/components/widgets/more-widget.vue'
import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { User } from '@/core/data/entities/User'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  user: User
}

const props = defineProps<Props>()

const router = useRouter()

const search = useSearch(fetchAssignedWorks, {
  immediate: true
})

const changeMentorModal = ref<{
  opened: boolean
  mentorId: string | null
  assignedWorks: AssignedWork[]
}>({
  opened: false,
  mentorId: null,
  assignedWorks: []
})

async function fetchAssignedWorks(pagination?: Pagination) {
  try {
    return await Core.Services.AssignedWork.getAssignedWorksFromUser(
      props.user.id,
      pagination
    )
  } catch (error: any) {
    Core.Services.UI.openErrorModal(
      'Произошла ошибка при получении списка работ',
      error.message
    )
  }
}

const cols: ColType[] = [
  {
    title: 'Название работы / Ученик / Куратор(ы)',
    keys: ['work.name', 'student.name', 'mentors.each.name'],
    join: '<br>',
    type: 'text',
    style: [undefined, 'secondary', 'secondary']
  },
  {
    title: 'Дедлайн сдачи/сдано',
    keys: ['solveDeadlineAt', 'solvedAt'],
    type: 'date'
  },
  {
    title: 'Дата проверки/проверено',
    keys: ['checkDeadlineAt', 'checkedAt'],
    type: 'date'
  },
  {
    title: 'Статус работы',
    keys: ['solveStatus', 'checkStatus'],
    type: 'tag',
    tagFunction
  },
  {
    title: 'Результат',
    keys: ['score', 'maxScore'],
    join: '/',
    style: ['centered'],
    type: 'text'
  }
]

function actions(assignedWork: AssignedWork): MenuItem[] {
  return [
    {
      title: 'Посмотреть',
      icon: 'eye',
      action: () => {
        router.push(`/assigned-works/${assignedWork.id}/read`)
      }
    },
    {
      title: 'Поменять куратора',
      icon: 'change-user',
      if:
        assignedWork.checkStatus === 'not-checked' ||
        assignedWork.checkStatus === 'in-progress',
      action: () => openChangeMentorModal([assignedWork])
    }
  ]
}

function tagFunction(
  key: string,
  value: string | number | Date
): {
  type: 'success' | 'danger' | 'info' | 'warning' | 'primary'
  text: string
} {
  if (value === 'made-in-deadline') {
    return {
      type: 'success',
      text: 'Сдано в дедлайн'
    }
  } else if (value === 'made-after-deadline') {
    return {
      type: 'danger',
      text: 'Сдано не в дедлайн'
    }
  } else if (value === 'checked-in-deadline') {
    return {
      type: 'info',
      text: 'Проверено в дедлайн'
    }
  } else if (value === 'checked-after-deadline') {
    return {
      type: 'warning',
      text: 'Проверено не в дедлайн'
    }
  } else if (value === 'checked-automatically') {
    return {
      type: 'info',
      text: 'Проверено автоматически'
    }
  } else if (value === 'not-made') {
    return {
      type: 'warning',
      text: 'Не сдано'
    }
  } else if (value === 'not-checked') {
    return {
      type: 'info',
      text: 'Не проверено'
    }
  }

  return {
    type: 'info',
    text: '-'
  }
}

const selectedWorks = ref<AssignedWork[]>([])

function onSelect(assignedWorkIds: AssignedWork['id'][]) {
  selectedWorks.value = search.results.value.filter((work) =>
    assignedWorkIds.includes(work.id)
  )
}

function openChangeMentorModal(assignedWorks: AssignedWork[]) {
  changeMentorModal.value = {
    opened: true,
    mentorId: null,
    assignedWorks
  }
}

function onMentorChanged() {
  selectedWorks.value = []
  search.trigger()
}

function onSelectAll() {
  selectedWorks.value = search.results.value
}
</script>

<style scoped lang="sass">
.assigned-works-view
  &__search
    padding: 1em

  &__selection
    padding: 1em
    display: flex
    justify-content: space-between

    &__text
      flex: 1px

    &__actions
      display: flex
      gap: 1em

  &__results
    margin-bottom: 1em

  &__pagination
    margin-top: 1em
</style>
