<template>
  <span
    class="list-opener-arrow"
    :class="{ 'list-opener-arrow--opened': opened }"
  >
    ▼
  </span>
</template>

<script setup lang="ts">
interface Props {
  opened?: boolean
}

defineProps<Props>()
</script>

<style scoped lang="sass">
.list-opener-arrow
	margin-right: 0.3rem
	cursor: pointer
	float: left
	transform: rotate(-90deg)
	transition: all 0.2s ease-in-out
	color: var(--secondary)

	&--opened
		transform: rotate(0)
</style>
