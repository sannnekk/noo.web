<template>
  <base-modal
    v-model:visible="visibilityModel"
    type="info"
    title="Все уведомления"
  >
    <div class="all-notifications-modal">
      <div
        class="all-notifications-modal__loading"
        v-if="search.isListLoading.value"
      >
        <loader-icon contrast />
      </div>
      <div
        class="all-notifications-modal__empty"
        v-else-if="search.results.value.length === 0"
      >
        <p>Пока нет уведомлений</p>
      </div>
      <div
        class="all-notifications-modal__list"
        v-else
      >
        <div
          class="all-notifications-modal__list__item"
          v-for="item in datedList"
          :key="item.id"
          :class="{
            'all-notifications-modal__list__item--unread':
              item._type !== 'date' && item.status === 'unread'
          }"
        >
          <app-notification
            v-if="item._type !== 'date'"
            :notification="item"
            @deleted="onDeleted"
          />
          <span
            class="all-notifications-modal__list__date-item"
            v-else
          >
            {{ useDate(item._date, { precision: 'day' }).toBeautiful() }}
          </span>
        </div>
      </div>
      <list-pagination
        v-model:page="search.pagination.value.page"
        :total="search.resultsMeta.value.total"
        :limit="search.pagination.value.limit"
      />
    </div>
  </base-modal>
</template>

<script setup lang="ts">
import { useDate } from '@/composables/useDate'
import { useDatedList } from '@/composables/useDatedList'
import { useSearch } from '@/composables/useSearch'
import { Core } from '@/core/Core'
import type { Pagination } from '@/core/data/Pagination'
import type { Notification } from '@/core/data/entities/Notification'
import { NOTIFICATION_PANE_LIMIT } from '@/core/services/store/NotificationService'
import { computed, watch } from 'vue'

interface Props {
  visible?: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const visibilityModel = computed({
  get: () => props.visible,
  set: (value: boolean) => emits('update:visible', value)
})

const search = useSearch(loadNotifications, {
  initialPagination: {
    page: 1,
    limit: NOTIFICATION_PANE_LIMIT,
    sort: 'id',
    order: 'DESC'
  },
  debounceTime: 0,
  immediate: false
})

const datedList = useDatedList(() => search.results.value, 'createdAt', {
  precision: 'day'
})

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      search.pagination.value.page = 1
      search.trigger()
    }
  }
)

async function loadNotifications(pagination: Pagination) {
  try {
    return await Core.Services.Notification.getAllNotifications(pagination)
  } catch (error: any) {
    Core.Services.UI.openErrorModal(
      'Не удалось загрузить уведомления',
      error.message
    )
  }
}

function onDeleted(id: Notification['id']) {
  search.results.value = search.results.value.filter((n) => n.id !== id)
  search.resultsMeta.value.total = Math.max(
    0,
    search.resultsMeta.value.total - 1
  )
}
</script>

<style scoped lang="sass">
.all-notifications-modal
  &__loading
    display: flex
    justify-content: center
    padding: 2em 0

  &__empty
    color: var(--text-light)
    text-align: center

  &__list
    &__item--unread
      border-left: 3px solid var(--lila)
      border-radius: var(--border-radius)

    &__date-item
      display: block
      color: var(--text-light)
      font-size: 0.8em
      margin-top: 1em
      margin-bottom: 0.5em
      text-transform: capitalize
</style>
