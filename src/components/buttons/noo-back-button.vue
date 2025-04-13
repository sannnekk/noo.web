<template>
  <router-link
    class="back-button"
    :to="to ?? '#'"
  >
    &#8249; <slot />
  </router-link>
</template>

<script setup lang="ts">
interface Props {
  to?: string
}

defineProps<Props>()
</script>

<style scoped lang="sass">
.back-button
	display: block
	margin-bottom: 1rem
	font-size: 0.8em
	color: var(--text-light)
	text-decoration: none

	&:hover
		color: var(--secondary)
</style>
