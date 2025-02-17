<template>
  <div class="index-view">
    <div class="index-view__banner-image">
      <nootube-image />
    </div>
    <tabs-view
      :titles="['Видео', 'Стримы (coming soon)', 'Избранное (coming soon)']"
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
        <stream-list-view />
      </template>
      <template #tab-2>
        <favourites-list-view />
      </template>
    </tabs-view>
  </div>
</template>

<script setup lang="ts">
import { setPageTitle } from '@/core/utils/setPageTitle'
import videoListView from '../components/video-list-view.vue'

setPageTitle('НОО.Tube')
</script>

<style scoped lang="sass">
.index-view
	&__greeting
		padding: 1em
		//padding-bottom: 4em

		&__text-block
			//display: none
			//position: absolute
			//right: 2em
			//bottom: 1em
			//width: 70%
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
</style>
