<template>
  <sure-modal
    v-model:visible="assignWorkStore.unassignModalVisible"
    @confirm="assignWorkStore.unassign()"
  >
    <template #title>
      <h3>Открепить работу</h3>
    </template>
    <template #text>
      <div class="assign-work-to-material-modal">
        <p>Вы уверены, что хотите открепить эту работу?</p>
        <warning-block>
          Ученики, которые приступили к выполнению этой работы, все равно смогут
          продолжить её выполнение
        </warning-block>
        <p v-if="assignWorkStore.selectedWorkId.length">
          Сейчас присвоена:
          <router-link
            class="assign-work-to-material-modal__current-work-link"
            :to="`/create-work${courseStore.material?.work?.slug}`"
          >
            {{ courseStore.material?.work?.name }}
          </router-link>
        </p>
      </div>
    </template>
  </sure-modal>
</template>

<script setup lang="ts">
import { useAssignWorkToMaterialStore } from '../stores/assign-work'
import { useCourseStore } from '../stores/course'

const assignWorkStore = useAssignWorkToMaterialStore()
const courseStore = useCourseStore()
</script>

<style lang="sass" scoped>
.assign-work-to-material-modal
  &__current-work-link
    color: var(--lila)
    text-decoration: underline
</style>
