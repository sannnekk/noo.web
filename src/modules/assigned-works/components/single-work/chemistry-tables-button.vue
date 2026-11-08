<template>
  <div
    class="chemistry-tables-button"
    v-if="isChemistry"
  >
    <inline-button
      icon="table"
      @click="modalVisible = true"
    >
      Таблицы по химии
    </inline-button>
    <base-modal
      v-model:visible="modalVisible"
      type="info"
      title="Справочные материалы"
    >
      <div class="chemistry-tables-button__tables">
        <a
          v-for="table in tables"
          :key="table.src"
          class="chemistry-tables-button__table"
          :href="table.src"
          target="_blank"
          title="Открыть в полном размере"
        >
          <img
            :src="table.src"
            :alt="table.alt"
            loading="lazy"
          />
        </a>
      </div>
    </base-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAssignedWorkStore } from '../../stores/assigned-work'

const assignedWorkStore = useAssignedWorkStore()

const modalVisible = ref(false)

const tables = [
  {
    src: '/img/chemistry/periodic-table.webp',
    alt: 'Периодическая система химических элементов Д.И. Менделеева'
  },
  {
    src: '/img/chemistry/solubility-table.webp',
    alt: 'Растворимость кислот, солей и оснований в воде'
  }
]

const isChemistry = computed(
  () =>
    assignedWorkStore.assignedWork?.work?.subject?.name?.trim() === 'Химия'
)
</script>

<style lang="sass" scoped>
.chemistry-tables-button
	padding: 0.3em 0
	margin-bottom: 0.5em
	font-size: 0.9em

	&__tables
		display: flex
		flex-direction: column
		gap: 1em
		margin-bottom: 1em

	&__table
		display: block
		cursor: zoom-in

		img
			display: block
			width: 100%
			height: auto
			border-radius: var(--border-radius)
</style>
