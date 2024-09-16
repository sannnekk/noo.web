<template>
  <div class="accordion-list">
    <div
      class="accordion-list__item"
      v-for="(item, index) in items"
      :key="index"
      v-auto-animate
    >
      <div class="accordion-list__item__head">
        <div class="accordion-list__item__head__opener-arrow">
          <list-opener-arrow :opened="opened[index]" />
        </div>
        <div class="accordion-list__item__head__content">
          <slot
            name="head"
            :item="item"
            :index="index"
            :open-action="() => (opened[index] = !opened[index])"
          />
        </div>
      </div>
      <div
        class="accordion-list__item__body"
        v-if="opened[index]"
      >
        <slot
          name="body"
          :item="item"
          :index="index"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  items: any[]
}

const props = defineProps<Props>()

const opened = ref<boolean[]>(props.items.map(() => false))
</script>

<style scoped lang="sass">
.accordion-list
	display: flex
	flex-direction: column
	gap: 0.5em

	&__item
		border: 1px solid var(--border-color)
		border-radius: var(--border-radius)
		transition: border-color 0.3s ease

		&:hover
			border-color: var(--form-text-color)

		&__head
			padding: 1rem
			cursor: pointer
			user-select: none
			display: flex
			align-items: center

			&__opener-arrow
				margin-right: 0.3em

			&__content
				flex: 1

		&__body
			padding: 1rem
			border-top: 1px solid var(--border-color)
</style>
