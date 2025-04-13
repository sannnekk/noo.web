<template>
  <div
    class="notifications-pane"
    v-auto-animate
    :class="{ open: notificationStore.isPaneOpen }"
  >
    <div class="notifications-pane__inner">
      <div class="notifications-pane__header">
        <h2>Уведомления</h2>
      </div>
      <div class="notifications-pane__body">
        <tabs-view
          :titles="['Непрочитанные', 'Прочитанные']"
          v-model:tab-index="currentTab"
        >
          <template #tab-0>
            <div
              class="notifications-pane__list__loading"
              v-if="notificationStore.isLoading"
            >
              <loader-icon contrast />
            </div>
            <div
              class="notifications-pane__list__empty"
              v-else-if="notificationStore.newNotifications.length === 0"
            >
              <p>Пока нет уведомлений</p>
            </div>
            <div
              class="notifications-pane__list"
              v-else
              v-auto-animate
            >
              <div
                class="notifications-pane__list__item"
                v-for="item in unreadNotificationsDatedList"
                :key="item.id"
              >
                <app-notification
                  v-if="item._type !== 'date'"
                  :notification="item"
                />
                <span
                  class="notifications-pane__list__date-item"
                  v-else
                >
                  {{ useDate(item._date, { precision: 'day' }).toBeautiful() }}
                </span>
              </div>
            </div>
          </template>
          <template #tab-1>
            <div
              class="notifications-pane__list__loading"
              v-if="notificationStore.isLoading"
            >
              <loader-icon contrast />
            </div>
            <div
              class="notifications-pane__list__empty"
              v-else-if="notificationStore.notifications.length === 0"
            >
              <p>Пока нет уведомлений</p>
            </div>
            <div
              class="notifications-pane__list"
              v-else
              v-auto-animate
            >
              <div
                class="notifications-pane__list__item"
                v-for="item in readNotificationsDatedList"
                :key="item.id"
              >
                <app-notification
                  v-if="item._type !== 'date'"
                  :notification="item"
                />
                <span
                  class="notifications-pane__list__date-item"
                  v-else
                >
                  {{ useDate(item._date, { precision: 'day' }).toBeautiful() }}
                </span>
              </div>
            </div>
          </template>
        </tabs-view>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <div
      v-if="notificationStore.isPaneOpen"
      v-auto-animate
      class="overlay"
      @click="notificationService.setPaneOpen(false)"
    ></div>
  </Teleport>
</template>

<script setup lang="ts">
import { useDate } from '@/composables/useDate'
import { useDatedList } from '@/composables/useDatedList'
import { Core } from '@/core/Core'
import { ref } from 'vue'

const notificationService = Core.Services.Notification
const notificationStore = notificationService.Store()

const currentTab = ref(0)

const readNotificationsDatedList = useDatedList(
  () => notificationStore.notifications,
  'createdAt',
  { precision: 'day' }
)
const unreadNotificationsDatedList = useDatedList(
  () => notificationStore.newNotifications,
  'createdAt',
  { precision: 'day' }
)
</script>

<style scoped lang="sass">
.overlay
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: #00000088
  z-index: 999998
  cursor: pointer

.notifications-pane
  position: fixed
  right: -350px
  top: 0
  z-index: 999999
  width: min(90%, 350px)
  height: 100%
  background-color: var(--lightest)
  transition: right 0.3s ease-in-out
  overflow-y: auto

  &.open
    right: 0

  &__inner
    display: flex
    flex-direction: column
    height: 100%

  &__header
    padding: 1em

    h2
      margin: 0
      margin-top: 1em

  &__body
    flex: 1

    &:deep()
      .tabs-view__titles
        padding-left: 1em !important
        padding-right: 0 !important
        justify-content: flex-start

        &__title
          padding: 10px 0 !important

  &__list
    height: 100%
    padding: 1em
    padding-top: 0

    &__date-item
      display: block
      color: var(--text-light)
      font-size: 0.8em
      margin-top: 1em
      margin-bottom: 0.5em
      text-transform: capitalize

    &__empty
      color: var(--text-light)
      padding: 1em
</style>
