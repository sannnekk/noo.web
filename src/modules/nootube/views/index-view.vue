<template>
  <div class="index-view">
    <div class="index-view__greeting">
      <div class="index-view__greeting__image">
        <nootube-image />
      </div>
      <div class="index-view__greeting__text-block">
        <h3>Теперь на <b>НОО.</b>Платформе доступны видео и стримы!</h3>
        <p>
          <b>НОО.</b>Tube - это место, где вы можете просматривать видео и
          стримы. Больше не нужно переключаться между разными платформами, всё
          собрано в одном месте!
        </p>
      </div>
    </div>
    <tabs-view :titles="['Видео', 'Стримы']">
      <template #tab-0>
        <div class="index-view__video-list">
          <video-list-view />
        </div>
      </template>
      <template #tab-1>
        <stream-list-view />
      </template>
    </tabs-view>
  </div>
</template>

<script setup lang="ts">
import videoListView from '../components/video-list-view.vue'
</script>

<style scoped lang="sass">
.index-view
	&__greeting
		padding: 1em
		padding-bottom: 4em
		position: relative

		&__image
			padding: 0 1em

		&__text-block
			position: absolute
			right: 2em
			bottom: 1em
			width: 70%
			padding: 1em
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

	&__video-list
		padding: 1em
</style>
