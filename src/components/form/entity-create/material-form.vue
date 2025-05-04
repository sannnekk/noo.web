<template>
  <div class="material-form">
    <div class="material-form__title">
      <h3>{{ model.name }}</h3>
    </div>
    <div class="form-group">
      <form-input
        type="text"
        v-model="model.name"
        label="Название материала"
      />
    </div>
    <div class="form-group">
      <text-area
        label="Описание"
        v-model="model.description"
      />
    </div>
    <div class="form-group">
      <rich-text-area
        label="Содержание"
        v-model="model.content"
      />
    </div>
    <div class="form-group">
      <poll-select
        label="Прикрепленный опрос (необязательно)"
        v-model="model.poll!"
      />
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="form-group dimmed-checkbox">
          <form-checkbox
            label="Запланировать публикацию"
            v-model="isSchedulingEnabled"
          />
        </div>
      </div>
      <div class="col-md-6">
        <div
          class="form-group dimmed-checkbox"
          v-auto-animate
        >
          <form-input
            v-if="model.activateAt"
            type="datetime-local"
            label="Дата публикации (МСК)"
            v-model="model.activateAt"
          />
          <warning-block class="test-functionality">
            Функционал находится в режиме тестирования разработчиками
          </warning-block>
        </div>
      </div>
    </div>
    <div class="form-group">
      <file-input
        label="Файлы, прикрепленные к материалу"
        :max-count="20"
        :allowed-mime-types="['application/pdf', 'image/jpeg', 'image/png']"
        :max-file-size="150 * 1024 * 1024"
        v-model="model.files"
      />
    </div>
    <div
      class="form-group"
      v-if="subjectId"
      v-auto-animate
    >
      <h3>Прикрепить работу</h3>
      <div class="form-group">
        <work-select
          :subject-id="subjectId"
          label="Прикрепленная работа (необязательно)"
          v-model="model.work!"
        />
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group dimmed-checkbox">
            <form-checkbox
              label="Установить дедлайны"
              v-model="areDeadlinesSet"
            />
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group dimmed-checkbox">
            <form-checkbox
              label="Работа доступна для сдачи"
              v-model="model.isWorkAvailable"
            />
          </div>
        </div>
      </div>
      <div
        class="row"
        v-if="areDeadlinesSet"
      >
        <div class="col-lg-6">
          <div class="form-group">
            <form-input
              type="date"
              label="Дедлайн сдачи"
              v-model="model.workSolveDeadline!"
            />
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group">
            <form-input
              type="date"
              label="Дедлайн проверки"
              v-model="model.workCheckDeadline!"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="form-group subejct-not-selected"
      v-else
    >
      <warning-block>
        Для прикрепления работы выберите предмет курса
      </warning-block>
    </div>
    <div class="form-group">
      <h3>Прикрепить видео из НОО.Tube <beta-tag /></h3>
      <br />
      <nootube-select-input
        :max-count="3"
        v-model="model.videos"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Material } from '@/core/data/entities/Material'
import { computed, ref, watch } from 'vue'
import Date from '@/core/utils/date'
import type { Subject } from '@/core/data/entities/Subject'

interface Props {
  modelValue: Material
  subjectId?: Subject['id']
}

interface Emits {
  (event: 'update:modelValue', value: Material): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (value: Material) => emit('update:modelValue', value)
})

const isSchedulingEnabled = computed({
  get: () => !!model.value.activateAt,
  set: (value: boolean) => {
    if (!value) {
      model.value.activateAt = null
    } else if (!model.value.activateAt) {
      model.value.activateAt = Date.tomorrow()
      model.value.isActive = false
    }
  }
})

const areDeadlinesSet = ref(false)
watch(areDeadlinesSet, setDeadlines)

if (model.value.workCheckDeadline || model.value.workCheckDeadline) {
  areDeadlinesSet.value = true
}

function setDeadlines(value: boolean) {
  if (!value) {
    model.value.workSolveDeadline = null
    model.value.workCheckDeadline = null
  } else if (!model.value.workCheckDeadline && !model.value.workCheckDeadline) {
    model.value.workSolveDeadline = Date.inDays(3)
    model.value.workCheckDeadline = Date.inDays(7)
  }
}
</script>

<style scoped lang="sass">
.form-group
	margin: 0.7em 0

	&.dimmed-checkbox
		&:deep()
			*
				color: var(--text-light)

			> *
				font-size: 0.9em

.test-functionality
	margin-top: 0.5em
	padding: 0.7em

	:deep()
		.warning-block__icon
			font-size: 2em

		.warning-block__text
			font-size: 0.9em
			color: var(--warning)
</style>
