<template>
  <div
    class="work-actions"
    v-if="assignedWorkStore.assignedWork?.work"
  >
    <common-button
      class="work-actions__primary"
      alignment="stretch"
      @click="assignedWorkStore.submitWork()"
      v-if="['check', 'solve'].includes(assignedWorkStore.mode)"
      :disabled="assignedWorkStore.autoSave.loading"
      :loading="assignedWorkStore.autoSave.loading"
    >
      {{
        assignedWorkStore.autoSave.loading
          ? 'Сохранение...'
          : assignedWorkStore.mode === 'check'
          ? 'Завершить проверку'
          : 'Завершить работу'
      }}
    </common-button>
    <common-button
      class="work-actions__secondary"
      alignment="stretch"
      @click="assignedWorkStore.remakeModal.visible = true"
      v-if="
        assignedWorkStore.mode === 'read' &&
        assignedWorkStore.assignedWork?.work?.type === 'test' &&
        Core.Context.roleIs(['student']) &&
        assignedWorkStore.assignedWork?.checkStatus == 'checked-automatically'
      "
    >
      Переделать работу
    </common-button>
    <common-button
      class="work-actions__secondary"
      alignment="stretch"
      design="inline"
      @click="assignedWorkStore.saveProgress()"
      v-if="['check', 'solve'].includes(assignedWorkStore.mode)"
      :disabled="assignedWorkStore.autoSave.loading"
    >
      {{
        assignedWorkStore.autoSave.loading
          ? 'Сохранение...'
          : 'Сохранить прогресс'
      }}
    </common-button>
    <common-button
      class="work-actions__secondary"
      alignment="stretch"
      design="inline"
      @click="assignedWorkStore.shiftDeadline()"
      v-if="
        assignedWorkStore.mode === 'check' &&
        assignedWorkStore.assignedWork.checkDeadlineAt
      "
    >
      Сдвинуть дедлайн проверки
    </common-button>
    <common-button
      class="work-actions__secondary"
      alignment="stretch"
      design="inline"
      @click="assignedWorkStore.shiftDeadline()"
      v-if="
        assignedWorkStore.mode === 'solve' &&
        assignedWorkStore.assignedWork.solveDeadlineAt
      "
    >
      Сдвинуть дедлайн
    </common-button>
    <common-button
      alignment="stretch"
      class="work-actions__secondary"
      design="inline"
      @click="assignedWorkStore.recheckAutomatically()"
      v-if="
        assignedWorkStore.mode === 'read' &&
        Core.Context.roleIs(['teacher', 'admin', 'mentor', 'assistant']) &&
        assignedWorkStore.assignedWork?.checkStatus == 'checked-automatically'
      "
    >
      Перепроверить автоматически
    </common-button>
    <common-button
      alignment="stretch"
      class="work-actions__secondary"
      design="inline"
      @click="assignedWorkStore.sendToRecheck()"
      v-if="
        assignedWorkStore.mode === 'read' &&
        Core.Context.roleIs(['mentor', 'teacher', 'assistant']) &&
        isWorkChecked(assignedWorkStore.assignedWork) &&
        assignedWorkStore.assignedWork.checkStatus !== 'checked-automatically'
      "
    >
      Отправить на перепроверку
    </common-button>
    <resolve-files-button
      class="work-actions__secondary"
      v-model:answers="assignedWorkStore.assignedWork.answers"
      v-model:student-comment="assignedWorkStore.assignedWork.studentComment"
      :assigned-work-id="assignedWorkStore.assignedWork.id"
      v-if="
        (assignedWorkStore.mode === 'read' ||
          assignedWorkStore.mode === 'check') &&
        Core.Context.roleIs(['teacher', 'mentor', 'assistant'])
      "
    />
    <common-button
      :to="
        Core.Context.roleIs(['teacher', 'admin']) ? '/works' : '/assigned-works'
      "
      alignment="stretch"
      design="inline"
      class="work-actions__secondary"
    >
      Вернуться к списку работ
    </common-button>
  </div>
  <div
    class="work-actions__loading"
    v-else
  >
    <loader-icon contrast />
  </div>
  <sure-modal
    v-model:visible="assignedWorkStore.sureSubmitModalVisible"
    @confirm="assignedWorkStore.submitWork()"
  >
    <template #title>
      {{
        assignedWorkStore.mode === 'check'
          ? 'Завершить проверку'
          : 'Завершить работу'
      }}
    </template>
    <template #text>
      {{
        assignedWorkStore.mode === 'check'
          ? 'Вы уверены, что хотите завершить проверку?'
          : 'Вы уверены, что хотите завершить работу?'
      }}
      <br />
      <br />
      <warning-block v-if="assignedWorkStore.sureSubmitModalError">
        {{ assignedWorkStore.sureSubmitModalError }}
      </warning-block>
    </template>
  </sure-modal>
  <sure-modal
    v-model:visible="assignedWorkStore.shiftDeadlineModalVisible"
    @confirm="assignedWorkStore.shiftDeadline()"
  >
    <template #title> Сдвинуть дедлайн на 3 дня </template>
    <template #text>
      Вы уверены, что хотите сдвинуть дедлайн?
      <br />
      <br />
      <warning-block> Сдвинуть дедлайн можно только один раз </warning-block>
    </template>
  </sure-modal>
  <sure-modal
    v-model:visible="assignedWorkStore.remakeModal.visible"
    @confirm="assignedWorkStore.remakeWork()"
  >
    <template #title>
      Вы уверены, что хотите заново сделать работу "{{
        assignedWorkStore.assignedWork?.work?.name
      }}"?
    </template>
    <template #text>
      <p>
        Уже решенная работа НЕ будет удалена, будет создана новая работа с теми
        же заданиями
      </p>
      <form-checkbox
        v-model="assignedWorkStore.remakeModal.onlyFalse"
        label="Перерешать только неправильные"
      />
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import ResolveFilesButton from './resolve-files-button.vue'
import { Core } from '@/core/Core'
import { useAssignedWorkStore } from '../../stores/assigned-work'
import { isWorkChecked } from '../../utils/task'

const assignedWorkStore = useAssignedWorkStore()
</script>

<style scoped lang="sass">
.work-actions
	margin-bottom: 1em

	&__primary
		margin-bottom: 1em

	&__secondary
		margin-bottom: 0.3em
		font-size: 0.8em
		width: 80%
		margin-left: 10%

	&__loading
		display: flex
		justify-content: center
		align-items: center
		min-height: 100px
		font-size: 30px
</style>
