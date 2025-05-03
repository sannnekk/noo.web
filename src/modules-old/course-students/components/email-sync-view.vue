<template>
  <div class="email-sync-view">
    <error-block v-if="errors.length > 0">
      <span
        v-for="error in errors"
        :key="error"
      >
        {{ error }}
        <br />
      </span>
    </error-block>
    <text-area
      v-model="emailsRaw"
      label="Список email (каждый с новой строки, пробелы не учитываются)"
    />
    <div>
      <span>
        Количество email:
        <b>{{ emailsCount }}</b>
      </span>
    </div>
    <common-button
      alignment="right"
      @click="syncEmails()"
      v-if="errors.length === 0 && emailsCount !== 0"
    >
      Синхронизировать
    </common-button>
  </div>
</template>

<script setup lang="ts">
import { validateEmail } from '@/core/validators/string'
import { ref, watch } from 'vue'
import { useCourseStudentsStore } from '../stores/course-students'

const courseStudentsStore = useCourseStudentsStore()

const emails = ref<string[]>([])
const emailsRaw = ref<string>('')
const emailsCount = ref<number>(0)
const errors = ref<string[]>([])

function syncEmails() {
  courseStudentsStore.syncStudentsViaEmail(emails.value)
}

function onInput() {
  errors.value = []

  const emailsList = emailsRaw.value
    .split('\n')
    .map((email) => email.trim())
    .filter((email) => email)

  emailsCount.value = emailsList.length

  for (const email of emailsList) {
    if (!email) {
      errors.value.push('Email не может быть пустым')
    } else if (!validateEmail(email)) {
      errors.value.push(`Email "${email}" не валиден`)
    }
  }

  if (errors.value.length === 0) {
    emails.value = emailsList
  }
}

watch(emailsRaw, onInput)
</script>

<style scoped lang="sass">
.email-sync-view
  padding: 1em

  :deep() textarea
    min-height: 500px
</style>
