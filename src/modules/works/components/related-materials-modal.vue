<template>
  <base-modal
    v-model:visible="visibilityModel"
    type="info"
    :title="`Присвоенные материалы для работы ${work?.name}`"
  >
    <div class="related-materials-modal__content">
      <div class="related-materials-modal__content__list">
        <entity-table
          :cols="cols"
          :data="search.results.value"
          :is-loading="search.isListLoading.value"
        />
      </div>
      <div
        class="related-materials-modal__content__pagination"
        v-if="
          search.resultsMeta.value.total > (search.pagination.value.limit || 0)
        "
      >
        <list-pagination
          v-model:page="search.pagination.value.page"
          :total="search.resultsMeta.value.total"
          :limit="search.pagination.value.limit"
        />
      </div>
    </div>
  </base-modal>
</template>

<script lang="ts" setup>
import type { ColType } from '@/components/structures/entity-table/entity-table.vue'
import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { Material } from '@/core/data/entities/Material'
import type { Work } from '@/core/data/entities/Work'
import { computed, watch } from 'vue'

interface Props {
  visible: boolean
  work: Work | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const workService = Core.Services.Work
const uiService = Core.Services.UI

const visibilityModel = computed({
  get: () => props.visible,
  set: (value: boolean) => emits('update:visible', value)
})

const cols: ColType[] = [
  {
    title: 'Курс',
    type: 'text',
    value: (material: Material) => material.chapter?.course?.name
  },
  {
    title: 'Материал',
    type: 'text',
    value: (material: Material) => material.name
  },
  {
    title: 'Дедлайн сдачи/проверки',
    type: 'date',
    joinType: '/',
    value: (material: Material) => [
      material.workSolveDeadline,
      material.workCheckDeadline
    ]
  }
]

async function fetchRelatedMaterials(pagination: Pagination) {
  if (!props.work) {
    return
  }

  try {
    return workService.getRelatedMaterials(props.work.id, pagination)
  } catch (error: any) {
    uiService.openErrorModal(
      'Произошла ошибка при получении списка материалов',
      error.message
    )
  }
}

const search = useSearch(fetchRelatedMaterials)

watch(
  () => props.work,
  async (work) => {
    if (work) {
      search.trigger()
    }
  }
)
</script>
