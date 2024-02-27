<template>
  <sure-modal
    v-model:visible="assignStudentsStore.modalVisible"
    @confirm="assignStudentsStore.save()"
  >
    <template #title>
      <h3>Ученики курса</h3>
    </template>
    <template #text>
      <div class="students-modal">
        <div class="students-modal__search">
          <search-field
            v-model="assignStudentsStore.pagination.search"
            :is-loading="assignStudentsStore.isListLoading"
          />
        </div>
        <br />
        <div class="students-modal__list">
          <check-list
            :items="assignStudentsStore.results"
            v-model="assignStudentsStore.selectedStudentIds"
            multiple
            item-label-key="name,username"
            item-key="id"
          />
          <list-pagination
            v-model:page="assignStudentsStore.pagination.page"
            :limit="assignStudentsStore.pagination.limit"
            :total="assignStudentsStore.resultsMeta.total"
          />
        </div>
      </div>
    </template>
  </sure-modal>
</template>

<script lang="ts" setup>
import { useAssignStudentsStore } from '../stores/assign-student'

const assignStudentsStore = useAssignStudentsStore()
</script>
