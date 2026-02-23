<template>
  <select-input
    :label="label"
    v-model="subjectModel!"
    :options="options"
  />
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { Subject } from '@/core/data/entities/Subject'
import { computed, ref } from 'vue'

interface Props {
  label: string
  modelValue: Subject['id'] | null
}

interface Emits {
  (event: 'update:modelValue', value: Subject['id'] | null): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const subjectService = Core.Services.Subject
const uiService = Core.Services.UI

const subjects = ref<Subject[]>([])

const options = computed(() =>
  subjects.value.map((subject) => ({
    value: subject.id,
    label: subject.name
  }))
)

async function fetchSubjects() {
  try {
    const response = await subjectService.getSubjects()
    subjects.value = response.data
  } catch (error: any) {
    uiService.openErrorModal(
      'Произошла ошибка при загрузке предметов',
      error.message
    )
  }
}

fetchSubjects()

const subjectModel = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})
</script>
