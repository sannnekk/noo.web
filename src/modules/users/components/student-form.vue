<template>
  <div class="student-form">
    <h3>Куратор:</h3>
    <div class="row">
      <div class="col-md-8 col-12">
        <user-card
          v-if="mentor"
          :user="mentor"
        />
        <p v-else>Пока нет куратора...</p>
      </div>
      <div class="col-md-4 col-12">
        <div class="student-form__actions">
          <common-button
            design="danger"
            alignment="stretch"
            @click="assignMentorModalVisible = true"
          >
            {{ mentor ? 'Поменять куратора' : 'Присвоить куратора' }}
          </common-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/core/data/entities/User'
import { ref } from 'vue'
import { useUserStore } from '../stores/user'

interface Props {
  mentor: User | undefined
}

interface Emits {
  (e: 'assignMentor', mentorId: User['id']): void
}

defineProps<Props>()
defineEmits<Emits>()

const userStore = useUserStore()

const assignMentorModalVisible = ref(false)

function onMentorSelectConfirm(newMentor: User | null) {
  userStore.user!.mentor = newMentor!
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
