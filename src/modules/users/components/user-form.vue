<template>
  <div class="user-form">
    <h3>Данные пользователя</h3>
    <div class="row">
      <div class="col-lg-6">
        <div class="form-group registration-date">
          <form-input
            v-model="model.createdAt"
            label="Дата регистрации"
            type="datetime-local"
            readonly
          />
        </div>
      </div>
      <div class="col-lg-6">
        <div
          class="form-group is-blocked"
          v-if="
            Core.Context.roleIs(['admin', 'teacher']) &&
            model.id !== Core.Context.User?.id
          "
        >
          <form-toggle
            v-model="model.isBlocked"
            :values="[
              {
                value: false,
                label: 'Пользователь разблокирован'
              },
              {
                value: true,
                label: 'Пользователь заблокирован'
              }
            ]"
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div
          class="form-group__course-list"
          v-if="model.role === 'teacher'"
        >
          <teacher-form :courses="model.courses" />
        </div>
        <div
          class="form-group__student-list"
          v-else-if="model.role === 'mentor'"
        >
          <mentor-form :students="studentsWithSubjects" />
        </div>
        <div
          class="form-group__student-mentors-list"
          v-else-if="model?.role === 'student'"
        >
          <h3 class="form-group__student-mentors-list__title">Кураторы</h3>
          <student-mentors-view
            :mentor-assignments="(model as any).mentorAssignmentsAsStudent"
            :student="model"
            @mentor-assigned="$emit('mentor-assigned')"
          />
        </div>
        <div
          class="form-group__student-mentors-list"
          v-if="model.role === 'student'"
        >
          <student-courses-view :user-id="model.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import studentCoursesView from './student-courses-view.vue'
import mentorForm from './mentor-form.vue'
import teacherForm from './teacher-form.vue'
import { computed, watch } from 'vue'
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
  (e: 'course-toggle'): void
  (e: 'blocked'): void
  (e: 'unblocked'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})

watch(
  () => model.value.isBlocked,
  (newValue) => {
    if (newValue === true) {
      emits('blocked')
    } else {
      emits('unblocked')
    }
  }
)
</script>

<style scoped lang="sass">
.form-group
  &.is-blocked
    margin-top: 1.8em
    display: flex
    color: var(--text-light)
    margin-bottom: 0.3em
</style>
