<template>
  <div class="noo-table-cell-user">
    <inline-user-card
      class="noo-table-cell-user__card"
      :user="value"
    />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  value: any
}

defineProps<Props>()
</script>

<style lang="sass" scoped>
.noo-table-cell-user
	&__card
		margin: 0
		justify-content: center
</style>
