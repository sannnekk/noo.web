<template>
  <div class="student-form">
    <h3>Куратор:</h3>
    <div class="row">
      <div class="col-md-8 col-12">
        <user-card
          v-if="mentor"
          :user="mentor"
          :link="`/users/edit/${mentor.username}`"
        />
        <p v-else>Пока нет куратора...</p>
      </div>
      <div class="col-md-4 col-12">
        <div class="student-form__actions">
          <common-button
            design="danger"
            alignment="stretch"
            @click="changeMentorModalVisible = true"
          >
            {{ mentor ? 'Поменять куратора' : 'Присвоить куратора' }}
          </common-button>
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <sure-modal
      class="change-mentor-modal"
      v-model:visible="changeMentorModalVisible"
      @confirm="onMentorSelectConfirm"
    >
      <template #title>
        <h3>Выберите куратора</h3>
      </template>
      <template #text>
        <div class="change-mentor-modal__search">
          <search-field
            v-model="userStore.mentorSearch.pagination.search"
            :is-loading="userStore.mentorSearch.isListLoading"
          />
        </div>
        <div class="change-mentor-modal__list">
          <check-list
            :items="userStore.mentorSearch.results"
            item-label-key="name"
            item-key="id"
            v-model="selectedMentorId"
          />
          <list-pagination
            v-model:page="userStore.mentorSearch.pagination.page"
            :total="userStore.mentorSearch.resultsMeta.total"
            :limit="userStore.mentorSearch.pagination.limit"
          />
        </div>
      </template>
    </sure-modal>
  </Teleport>
</template>

<script setup lang="ts">
import type { User } from '@/core/data/entities/User'
import { ref } from 'vue'
import { Core } from '@/core/Core'
import { useUserStore } from '../stores/user'

interface Props {
  mentor: User | undefined
}

interface Emits {
  (e: 'assignMentor', mentorId: User['id']): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const userStore = useUserStore()

const changeMentorModalVisible = ref(false)

const selectedMentorId = ref<string[]>(props.mentor ? [props.mentor.id] : [])

function onMentorSelectConfirm() {
  if (!selectedMentorId.value.length) {
    return Core.Services.UI.openWarningModal('Куратор не выбран')
  }

  userStore.assignMentor(selectedMentorId.value[0])
}
</script>

<style scoped lang="sass">
.student-form

  &__actions
    margin-top: 1.3em
    font-size: 0.8em

.change-mentor-modal
  &__list
    margin-top: 1.3em
</style>
