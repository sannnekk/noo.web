<template>
  <div class="user-form">
    <h3>Данные пользователя</h3>
    <div class="row">
      <div class="col-md-6">
        <div class="form-group registration-date">
          <form-input
            v-model="model.createdAt"
            label="Дата регистрации"
            type="datetime-local"
            readonly
          />
        </div>
      </div>
      <div class="col-md-6">
        <div
          class="form-group is-blocked"
          v-if="Core.Context.roleIs(['admin', 'teacher'])"
        >
          <form-checkbox
            :readonly="model.id === Core.Context.User?.id"
            v-model="model.isBlocked"
            label="Заблокирован"
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div
          class="fomr-group__course-list"
          v-if="model.role === 'teacher'"
        >
          <teacher-form :courses="model.courses" />
        </div>
        <div
          class="fomr-group__student-list"
          v-else-if="model.role === 'mentor'"
        >
          <mentor-form :students="studentsWithSubjects" />
        </div>
        <div
          class="fomr-group__student-statistics"
          v-else-if="model.role === 'student'"
        >
          <student-mentors-view
            :mentor-assignments="(model as any).mentorAssignmentsAsStudent"
            :student="model"
            @mentor-assigned="$emit('mentor-assigned')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import mentorForm from './mentor-form.vue'
import teacherForm from './teacher-form.vue'
import { computed } from 'vue'
import type { User } from '@/core/data/entities/User'
import { Core } from '@/core/Core'
import type { UserWithSubject } from '@/modules/students/stores/students'

interface Props {
  modelValue: User
  studentsWithSubjects: UserWithSubject[]
}

interface Emits {
  (e: 'update:modelValue', value: Partial<User>): void
  (e: 'mentor-assigned'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})

const roles = [
  {
    label: 'Ученик',
    value: 'student'
  },
  {
    label: 'Куратор',
    value: 'mentor'
  },
  {
    label: 'Преподаватель',
    value: 'teacher'
  },
  {
    label: 'Администратор',
    value: 'admin'
  }
]
</script>

<style scoped lang="sass">
.form-group
  &.is-blocked
    margin-top: 1.8em
    display: flex
    justify-content: center
</style>
