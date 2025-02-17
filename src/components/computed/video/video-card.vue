<template>
  <div class="video-card">
    <router-link
      class="video-card__preview"
      :to="link"
    >
      <div class="video-card__preview__view-button">
        <inline-icon name="play" />
      </div>
      <div class="video-card__preview__image">
        <uploaded-image :src="video.thumbnail?.src" />
      </div>
      <div class="video-card__preview__duration">
        {{ duration }}
      </div>
    </router-link>
    <div class="video-card__info">
      <div class="video-card__info__header">
        <h3 class="video-card__info__title">
          <router-link :to="link">{{ video.title }}</router-link>
        </h3>
        <div class="video-card__info__actions">
          <more-widget :items="actions" />
        </div>
      </div>
      <div class="video-card__info__author">
        <inline-user-card :user="video.uploadedBy" />
      </div>
    </div>
  </div>
  <sure-delete-modal
    v-model:visible="deleteVideoModalVisible"
    @confirm="$emit('delete-video', video.id)"
  >
    <template #title>Удаление видео</template>
    <template #text>
      Вы уверены, что хотите удалить видео "{{ video.title }}"?
    </template>
  </sure-delete-modal>
</template>

<script setup lang="ts">
import type { Video } from '@/core/data/entities/Video'
import { computed, reactive, ref } from 'vue'
import { stringifyDuration } from './utils'
import type { MenuItem } from '../../widgets/more-widget.vue'
import { Core } from '@/core/Core'

interface Props {
  video: Video
}

interface Emits {
  (event: 'delete-video', videoId: Video['id']): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const link = computed(() => `/nootube/video/${props.video.id}`)
const duration = computed(() => stringifyDuration(props.video.duration))
const deleteVideoModalVisible = ref(false)

const actions = reactive<MenuItem[]>([
  {
    title: 'В избранное (coming soon)',
    icon: 'heart',
    action: () => {}
  },
  {
    title: 'Удалить',
    icon: 'delete',
    if:
      Core.Context.roleIs(['teacher', 'admin']) ||
      Core.Context.User?.id === props.video.uploadedBy?.id,
    action: () => {
      deleteVideoModalVisible.value = true
    }
  }
])
</script>

<style scoped lang="sass">
.video-card
	display: flex
	gap: 1em

	@media (max-width: 700px)
		flex-direction: column

	&__preview
		position: relative
		cursor: pointer
		display: block
		text-decoration: none
		color: inherit
		width: min(100%, 300px)

		@media (max-width: 700px)
			width: 100%

		&:hover
			.video-card__preview__view-button
				transform: translate(-50%, -50%) scale(1.2)
				opacity: 1

		&__image
			width: 100%
			height: 100%
			overflow: hidden
			border-radius: var(--border-radius)

			img
				width: 100%
				height: 100%
				object-fit: cover

		&__duration
			position: absolute
			bottom: 5px
			right: 5px
			background: rgba(0, 0, 0, 0.5)
			color: white
			padding: 0em 0.5em
			border-radius: var(--border-radius)

		&__view-button
			position: absolute
			top: 50%
			left: 50%
			transform: translate(-50%, -50%) scale(0.5)
			font-size: 4em
			color: white
			cursor: pointer
			transition: 0.2s ease all
			opacity: 0

			&:hover
				transform: translate(-50%, -50%) scale(1.3) !important

	&__info
		flex: 1
		padding: 1em
		display: flex
		flex-direction: column
		justify-content: center

		&__header
			display: flex
			justify-content: space-between
			align-items: center

		&__title
			flex: 1
			font-size: 1.5em
			margin: 0

			a
				color: inherit
				text-decoration: none

				&:hover
					color: var(--lila)

		&__author
			margin-top: 0em

		&__description
			margin-top: 0.3em
			font-size: 0.9em
			color: #666

			:deep()
				.quill-editor__content
					padding: 0
</style>
