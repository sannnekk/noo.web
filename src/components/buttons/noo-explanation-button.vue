<template>
  <div
    class="explanation-tooltip"
    :title="title"
    @click="modalVisible = true"
  >
    <inline-icon name="question" />
  </div>
  <base-modal
    v-model:visible="modalVisible"
    :title="title"
    type="info"
  >
    <slot />
  </base-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title: string
}

defineProps<Props>()

const modalVisible = ref(false)
</script>

<style scoped lang="sass">
.explanation-tooltip
	cursor: pointer
	display: inline-block
	margin-left: 0.3em
	position: relative
	top: 0.1em

	&:hover
		--text-light: var(--form-text-color)
</style>
