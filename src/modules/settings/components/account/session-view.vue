<template>
  <div
    class="session-view"
    v-auto-animate
  >
    <div
      class="session-view__items row"
      v-if="!isLoading && sessions.length > 0"
      v-auto-animate
    >
      <div
        class="col-md-4 col-12"
        v-for="session in sessions"
        :key="session.id"
      >
        <session-card
          v-bind="session"
          @delete-session="deleteSession(session.id)"
        />
      </div>
    </div>
    <div
      class="session-view__is-loading"
      v-else-if="isLoading"
    >
      <loader-icon contrast />
    </div>
    <div
      class="session-view__error"
      v-else
    >
      <error-block>
        {{ error }}
      </error-block>
    </div>
  </div>
</template>

<script setup lang="ts">
import SessionCard from './session-card.vue'
import { Core } from '@/core/Core'
import type { Session } from '@/core/data/entities/Session'
import { ref } from 'vue'

const isLoading = ref(true)
const error = ref<string>('')
const sessions = ref<Session[]>([])

async function fetchSessions() {
  isLoading.value = true

  try {
    const response = await Core.Services.Session.getSessions()
    sessions.value = response.data
  } catch (error: any) {
    error.value = error.message
  } finally {
    isLoading.value = false
  }
}

async function deleteSession(sessionId: string) {
  isLoading.value = true

  try {
    await Core.Services.Session.deleteSession(sessionId)
    await fetchSessions()
  } catch (error: any) {
    error.value = error.message
  } finally {
    isLoading.value = false
  }
}

fetchSessions()
</script>

<style lang="sass" scoped>
.session-view
  &__is-loading
    display: flex
    justify-content: center
    align-items: center
    padding: 3em 0
    font-size: 40px

  &__error
    display: flex
    justify-content: center
    align-items: center
    height: 100%
</style>
