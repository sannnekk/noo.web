<template>
  <div class="create-poll-form-question">
    <div class="create-poll-form-question__title">
      <h4>Вопрос {{ index + 1 }}</h4>
      <span class="create-poll-form-question__title__delete-button">
        <inline-icon
          name="delete"
          @click="$emit('remove')"
        />
      </span>
    </div>
    <div class="create-poll-form-question__form">
      <form-checkbox
        label="Обязательный"
        v-model="model.required"
      />
      <select-input
        v-model="model.type"
        label="Тип вопроса"
        :options="questionTypes"
        :readonly="!props.changeableType"
      />
      <form-input
        type="text"
        v-model="model.text"
        label="Текст вопроса"
        :validators="[
					($v: any) => !!$v || 'Введите название опроса',
					($v: any) => $v.length <= 150 || 'Максимальная длина 150 символов'
				]"
      />
      <text-area
        type="text"
        v-model="model.description!"
        label="Описание вопроса"
      />
    </div>
    <div
      class="create-poll-form-question__type-specific-form"
      v-auto-animate
    >
      <component
        :is="typeSpecificFormComponent"
        v-model="model"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {
  PollQuestion,
  QuestionType
} from '@/core/data/entities/PollQuestion'
import { computed, shallowRef, watch } from 'vue'

interface Props {
  index: number
  modelValue: PollQuestion
  changeableType?: boolean
}

interface Emits {
  (event: 'update:modelValue', value: PollQuestion): void
  (event: 'remove'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const questionTypes: {
  value: QuestionType
  label: string
}[] = [
  { value: 'date', label: 'Дата' },
  { value: 'text', label: 'Текст' },
  { value: 'number', label: 'Число' },
  { value: 'file', label: 'Файл' },
  { value: 'rating', label: 'Рейтинг' },
  { value: 'choice', label: 'Варианты ответа' }
]

const typeSpecificFormComponent = shallowRef()

watch(
  () => model.value.type,
  (type) => {
    import(`./poll-question-forms/${type}-form.vue`).then((component) => {
      typeSpecificFormComponent.value = component.default
    })
  },
  { immediate: true }
)
</script>

<style lang="sass" scoped>
.create-poll-form-question
	padding: 1em
	border: 1px solid var(--border-color)
	border-radius: var(--border-radius)
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)

	&__title
		margin-bottom: 1em
		display: flex
		align-items: center

		h4
			flex: 1
			margin: 0
			font-size: 1.2em
			font-weight: 500

		&__delete-button
			cursor: pointer
			transition: transform 0.2s

			&:hover
				transform: scale(1.1)
</style>
