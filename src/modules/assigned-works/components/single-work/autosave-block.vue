<template>
  <div
    class="autosave-block"
    v-if="
      assignedWorkStore.mode !== 'read' &&
      Core.Context.roleIs(['student', 'mentor'])
    "
  >
    <div class="autosave-block__title">
      <h4>Автосохранение</h4>
    </div>
    <div
      class="autosave-block__content"
      :key="`${assignedWorkStore.autoSave.enabled}`"
    >
      <form-toggle
        v-model="assignedWorkStore.autoSave.enabled"
        :values="[
          {
            value: false,
            label: 'Выключено'
          },
          {
            value: true,
            label: 'Включено'
          }
        ]"
      />
    </div>
    <div class="autosave-block__status">
      <span
        class="autosave-block__status__loading"
        v-if="assignedWorkStore.autoSave.loading"
      >
        Сохранение...
      </span>
      <span
        class="autosave-block__status__success"
        v-else-if="assignedWorkStore.autoSave.state === 'success'"
      >
        Сохранено, в ожидании изменений
      </span>
      <span
        class="autosave-block__status__error"
        v-else-if="assignedWorkStore.autoSave.state === 'error'"
      >
        Ошибка
      </span>
      <span
        class="autosave-block__status__unset"
        v-else
      >
        Не сохранено
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import { useAssignedWorkStore } from '../../stores/assigned-work'

const assignedWorkStore = useAssignedWorkStore()
</script>

<style scoped lang="sass">
.autosave-block
	display: flex
	flex-direction: column
	align-items: center
	padding: 0.5em
	border: 1px solid var(--border-color)
	border-radius: var(--border-radius)
	margin: 0.5em 0

	&__title
		margin-bottom: 0.5em

		h4
			margin: 0

	&__content
		display: flex
		align-items: center
		margin-bottom: 0.3em

	&__status
		font-size: 0.8em

	&__status__loading
		color: var(--text-light)

	&__status__success
		color: var(--success)

	&__status__error
		color: var(--danger)

	&__status__unset
		color: var(--text-light)
</style>
