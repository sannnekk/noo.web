<template>
  <div class="student-form">
    <h3>Куратор:</h3>
    <div class="row">
      <div class="col-8">
        <user-card
          v-if="mentor"
          :user="mentor"
          :link="`/users/edit/${mentor.username}`"
        />
        <p v-else>Пока нет куратора...</p>
      </div>
      <div class="col-4">
        <div class="student-form__actions">
          <common-button
            design="danger"
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
          <search-field v-model="usersStore.mentorsSearch" />
        </div>
        <div class="change-mentor-modal__list">
          <check-list
            :items="usersStore.foundMentors"
            item-label-key="name"
            item-key="id"
            v-model="selectedMentorId"
          />
        </div>
      </template>
    </sure-modal>
  </Teleport>
</template>

<script setup lang="ts">
import type { User } from '@/types/entities/User'
import { ref } from 'vue'
import { useUsersStore } from '../stores/user'
import { useGlobalStore } from '@/store'

interface Props {
  mentor: User | undefined
}

const props = defineProps<Props>()

const usersStore = useUsersStore()
const globalStore = useGlobalStore()

const changeMentorModalVisible = ref(false)

const selectedMentorId = ref<string[]>(props.mentor ? [props.mentor.id] : [])

function onMentorSelectConfirm() {
  if (!selectedMentorId.value.length) {
    return globalStore.openModal('warning', 'Куратор не выбран')
  }

  usersStore.assignMentor(selectedMentorId.value[0])
}
</script>

<style scoped lang="sass">
.student-form

  &__actions
    margin-top: 1.3em

.change-mentor-modal
  &__list
    margin-top: 1.3em
</style>
