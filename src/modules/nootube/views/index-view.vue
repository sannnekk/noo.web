<template>
  <div class="index-view">
    <div class="index-view__banner-image">
      <nootube-image />
    </div>
    <tabs-view
      :titles="['Видео', 'Избранное', 'Стримы (coming soon)']"
      v-model:tab-index="nootubeStore.activeTabIndex"
    >
      <template #tab-0>
        <div class="index-view__greeting">
          <div class="index-view__greeting__text-block">
            <h3>Теперь на <b>НОО.</b>Платформе доступны видео и стримы!</h3>
            <p>
              <b>НОО.</b>Tube - это место, где вы можете просматривать видео и
              стримы. Больше не нужно переключаться между разными платформами,
              всё собрано в одном месте!
            </p>
          </div>
        </div>
        <div class="index-view__videos">
          <video-list-view />
        </div>
      </template>
      <template #tab-1>
        <div class="index-view__saved-videos">
          <saved-video-list-view />
        </div>
      </template>
      <template #tab-2>
        <div class="index-view__streams">
          <feature-block version="3.6.0" />
        </div>
      </template>
    </tabs-view>
  </div>
</template>

<script setup lang="ts">
import { setPageTitle } from '@/core/utils/setPageTitle'
import videoListView from '../components/video-list-view.vue'
import savedVideoListView from '../components/saved-video-list-view.vue'
import { useNooTubeStore } from '../stores/nootube'

const nootubeStore = useNooTubeStore()

setPageTitle('НОО.Tube')
</script>

<style scoped lang="sass">
.index-view
	&__greeting
		padding: 1em

		&__text-block
			padding: 1em
			padding-bottom: 0.3em
			background-color: var(--form-background)
			border-radius: var(--border-radius)
			box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1)

			h3
				font-size: 1.5em
				margin-bottom: 1em
				font-weight: 100
				margin-top: 0

			p
				color: var(--text-light)

	&__banner-image
		padding: 0

	&__videos
		padding: 1em
		padding-top: 0

	&__saved-videos
		padding: 1em
		padding-top: 0

	&__streams
		padding: 1em
		padding-top: 1em
</style>
