<template>
  <div class="settings-block">
    <div class="settings-block__section">
      <form-toggle
        v-model="assignedWorkStore.settings.showSolveHints"
        :values="[
          { value: false, label: 'Скрывать подсказки' },
          { value: true, label: 'Показывать подсказки' }
        ]"
      />
    </div>
    <div
      class="settings-block__section"
      v-if="assignedWorkStore.mode !== 'solve'"
    >
      <form-toggle
        v-model="assignedWorkStore.settings.showCheckHints"
        :values="[
          { value: false, label: 'Скрывать пояснения' },
          { value: true, label: 'Показывать пояснения' }
        ]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAssignedWorkStore } from '../../stores/assigned-work'

const assignedWorkStore = useAssignedWorkStore()
</script>

<style scoped lang="sass">
.settings-block
	color: var(--text-light)
	font-size: 0.8em
</style>
