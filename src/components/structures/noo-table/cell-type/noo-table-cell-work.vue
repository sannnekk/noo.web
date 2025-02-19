<template>
  <div class="noo-table-cell-work">
    <subject-name
      :subject="value.subject"
      class="noo-table-cell-work__subject"
    />
    <span class="noo-table-cell-work__name">{{ value.name }}</span>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  value: any
}

defineProps<Props>()
</script>

<style lang="sass" scoped>
.noo-table-cell-work
	&__name
		margin: 0
		justify-content: center

	&__subject
		padding: 0
		font-size: 0.7em
		justify-content: center
</style>
