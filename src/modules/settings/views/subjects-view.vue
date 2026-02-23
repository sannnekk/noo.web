<template>
  <div
    class="subjects-view"
    v-if="!subjectStore.moduleLoading"
  >
    <div class="subjects-view__disclaimer">
      <info-block>
        Добавлять, изменять и удалять предметы может только администратор
      </info-block>
    </div>
    <settings-section>
      <template #title>Предметы</template>
      <template #content>
        <subject-list
          :subjects="subjectStore.subjects"
          @update-subject="subjectStore.updateSubject($event)"
          @delete-subject="subjectStore.deleteSubject($event)"
        />
      </template>
    </settings-section>
    <settings-section v-if="Core.Context.roleIs(['admin'])">
      <template #title>Добавить предмет</template>
      <template #content>
        <create-subject-form
          @create-subject="subjectStore.createSubject($event)"
        />
      </template>
    </settings-section>
  </div>
  <div
    class="subjects-view__loading"
    v-else
  >
    <loader-icon contrast />
  </div>
</template>

<script lang="ts" setup>
import SettingsSection from '../components/settings-section.vue'
import subjectList from '../components/subjects/subject-list.vue'
import createSubjectForm from '../components/subjects/create-subject-form.vue'
import { useSubjectsStore } from '../stores/subjects'
import { Core } from '@/core/Core'

const subjectStore = useSubjectsStore()

subjectStore.fetchSubjects()
</script>

<style lang="sass" scoped>
.subjects-view
  &__loading
    display: flex
    justify-content: center
    align-items: center
    height: 500px
    font-size: 3em
</style>
