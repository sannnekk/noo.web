<template>
  <div
    class="user-result-view"
    v-if="
      resultStore.answers.length &&
      resultStore.poll &&
      (resultStore.user || resultStore.telegramUsername)
    "
  >
    <the-sidebar-layout>
      <template #sidebar>
        <div class="user-result-view__sidebar">
          <back-button
            to="/profile"
            v-if="Core.Context.roleIs(['student', 'mentor'])"
          >
            Назад к профилю
          </back-button>
          <back-button
            :to="`/polls/${resultStore.poll.id}/results`"
            v-else
          >
            Назад ко всем результатам
          </back-button>
          <h3>Опрос:</h3>
          <p>{{ resultStore.poll.title }}</p>
          <h3>Дата голосования:</h3>
          <p>
            {{
              useDate(resultStore.answers[0]?.createdAt!, {
                precision: 'day'
              }).toBeautiful()
            }}
          </p>
          <h3>Пользователь:</h3>
          <user-card
            v-if="resultStore.user"
            :user="resultStore.user"
          />
          <telegram-button
            v-else-if="!resultStore.telegramUsername.includes('_telegram_id_')"
            :username="resultStore.telegramUsername"
          />
          <p
            v-else
            class=""
          >
            Настройки конфиденциальности Telegram не позволяют показать
            информацию о пользователе
          </p>
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
    v-if="resultStore.currentQuestion && resultStore.answerToEdit"
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
import { Core } from '@/core/Core'

const resultStore = useUserResultStore()
const editAnswerModalVisible = ref(false)

resultStore.fetchAnswers()

function editAnswer(answerId: PollAnswer['id']) {
  resultStore.answerToEdit = resultStore.answers.find((a) => a.id === answerId)!
  editAnswerModalVisible.value = true
}
</script>
