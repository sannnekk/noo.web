<template>
  <div
    class="the-banner-container"
    v-auto-animate
  >
    <div
      class="the-banner-container__banner"
      v-for="item in notificationStore.banners"
      :key="item.id"
    >
      <app-notification
        :notification="item"
        preserve-line-wraps
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'

const notificationService = Core.Services.Notification
const notificationStore = notificationService.Store()
</script>

<style lang="sass" scoped>
.the-banner-container
	&__banner
		padding: 0.5em 0

		&:first-child
			padding-top: 1em

		&:last-child
			padding-bottom: 0
</style>
