<template>
  <div class="app-notification">
    <div
      class="app-notification__icon"
      :key="icon"
    >
      <inline-icon
        :name="icon"
        v-if="!isLoading"
      />
      <loader-icon
        contrast
        v-else
      />
    </div>
    <div class="app-notification__text">
      <h4 class="app-notification__info__title">
        {{ notification.title }}
      </h4>
      <p class="app-notification__info__message">
        {{ notification.message }}
      </p>
    </div>
    <div class="app-notification__actions">
      <div
        class="app-notification__actions__delete"
        @click="onNotificationDelete()"
      >
        <inline-icon name="delete" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Notification } from '@/core/data/entities/Notification'
import type { IconName } from '@/components/decorations/inline-icon.vue'
import { Core } from '@/core/Core'

interface Props {
  notification: Notification
}

const props = defineProps<Props>()

const notificationService = Core.Services.Notification
const uiService = Core.Services.UI

const isLoading = ref(false)

const icon = computed<IconName>(() => {
  switch (props.notification.type) {
    case 'work-checked':
      return 'check-green'
    case 'work-made':
      return 'uni-cap'
    case 'maintenance':
      return 'attention-yellow'
    case 'new-feature':
      return 'add'
    case 'announcement':
      return 'danger'
    case 'mentor-assigned':
      return 'heart'
    case 'mentor-removed':
      return 'cross-red'
    case 'poll-answered':
      return 'poll'
    case 'warning':
      return 'attention-yellow'
    case 'welcome':
      return 'welcome'
    case 'work-transferred':
      return 'copy'
    case 'other':
    default:
      return 'info'
  }
})

async function onNotificationDelete() {
  isLoading.value = true

  try {
    notificationService.deleteNotification(props.notification.id)
  } catch (error: any) {
    uiService.openErrorModal('Не удалось удалить уведомление', error.message)
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
}
</script>

<style scoped lang="sass">
.app-notification
	display: flex
	align-items: center
	padding: 1em
	margin-bottom: 0.5em
	border-radius: var(--border-radius)
	background-color: var(--form-background)
	box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1)

	&__icon
		margin-right: 0.5em
		font-size: 30px

	&__text
		flex: 1

	&__info
		&__title
			margin: 0
			font-weight: 500

			&__time
				font-size: 0.8em
				color: var(--text-light)
				margin-left: 0.5em

		&__message
			margin: 0
			font-size: 0.9em
			color: var(--text-light)
			margin-top: 0.3em
			line-height: 1.2

	&__actions
		display: flex
		align-items: center
		padding-left: 0.5em

		&__delete
			cursor: pointer

			&:hover
				--danger: var(--text-light)
</style>
