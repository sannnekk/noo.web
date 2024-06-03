<template>
  <div
    class="user-result-view"
    v-if="resultStore.user && resultStore.answers.length && resultStore.poll"
  >
    <the-sidebar-layout>
      <template #sidebar>
        <div class="user-result-view__sidebar">
          <router-link
            class="user-result-view__back"
            :to="`/poll/${resultStore.poll.id}/results`"
          >
            Назад ко всем результатам
          </router-link>
          <h3>Опрос:</h3>
          <p>{{ resultStore.poll.title }}</p>
          <h3>Дата голосования:</h3>
          <p>
            {{
              useDate(resultStore.answers.at(0)!.createdAt!, {
                precision: 'day'
              }).toBeautiful()
            }}
          </p>
          <h3>Пользователь:</h3>
          <user-card :user="resultStore.user" />
        </div>
      </template>
      <template #content>
        <answer-list
          :answers="resultStore.answers"
          :questions="resultStore.poll.questions"
          @edit="editAnswer($event)"
        />
      </template>
    </the-sidebar-layout>
  </div>
  <edit-answer-modal
    v-if="resultStore.currentQuestion"
    v-model:answer="resultStore.answerToEdit"
    v-model:visible="editAnswerModalVisible"
    :question="resultStore.currentQuestion"
    @submit="resultStore.submitAnswer()"
  />
</template>

<script setup lang="ts">
import editAnswerModal from '../components/edit-answer-modal.vue'
import { ref } from 'vue'
import answerList from '../components/answer-list.vue'
import { useUserResultStore } from '../stores/result'
import { useDate } from '@/composables/useDate'
import type { PollAnswer } from '@/core/data/entities/PollAnswer'

const resultStore = useUserResultStore()
const editAnswerModalVisible = ref(false)

resultStore.fetchAnswers()

function editAnswer(answerId: PollAnswer['id']) {
  resultStore.answerToEdit = resultStore.answers.find((a) => a.id === answerId)!
  editAnswerModalVisible.value = true
}
</script>

<style scoped lang="sass">
.user-result-view
  &__back
    display: block
    margin-bottom: 20px
    color: var(--text-light)
    font-size: 14px
    text-decoration: none

    &:hover
      text-decoration: underline
</style>
