<template>
  <base-modal
    class="banner-modal"
    :title="title"
    type="info"
    v-model:visible="visibilityModel"
  >
    <p class="banner-modal__head">
      <inline-icon
        class="banner-modal__head__icon"
        :name="icon"
      />
      <b>{{ banner.title }}</b>
    </p>
    <p
      class="banner-modal__body"
      v-html="message"
    ></p>
  </base-modal>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { Notification } from '@/core/data/entities/Notification'
import { computed } from 'vue'
import type { IconName } from '../decorations/inline-icon.vue'

interface Props {
  banner: Notification
  visible?: boolean
  onClose: () => void
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const title = computed(() => {
  switch (props.banner.type) {
    case 'announcement':
      return 'Объявление'
    case 'maintenance':
      return 'Технические работы'
    case 'new-feature':
      return 'Новая функция'
    case 'warning':
      return 'Предупреждение'
    case 'welcome':
      return 'Добро пожаловать'
    case 'other':
    default:
      return 'Уведомление'
  }
})

const icon = computed<IconName>(() => {
  switch (props.banner.type) {
    case 'work-checked':
      return 'check-green'
    case 'work-made':
      return 'uni-cap'
    case 'maintenance':
      return 'attention-yellow'
    case 'new-feature':
      return 'add'
    case 'announcement':
      return 'attention-yellow'
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

const message = computed(() => {
  return props.banner.message?.replaceAll('\n', '<br>') || ''
})

const visibilityModel = computed({
  get: () => props.visible,
  set: (value: boolean) => {
    emits('update:visible', value)

    if (!value) {
      props.onClose()
      Core.Services.Notification.markAsRead(props.banner.id)
    }
  }
})
</script>

<style scoped lang="sass">
.banner-modal
	text-align: center !important

	&__head
		display: flex
		align-items: center
		gap: 0.5em

		&__icon
			font-size: 20px
</style>
