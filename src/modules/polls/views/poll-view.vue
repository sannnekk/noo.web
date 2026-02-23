<template>
  <div
    class="index-view"
    v-if="pollStore.poll"
  >
    <the-sidebar-layout>
      <template #sidebar>
        <div class="index-view__header">
          <h2>{{ pollStore.poll.title }}</h2>
        </div>
        <div class="index-view__description">
          <p>{{ pollStore.poll.description }}</p>
        </div>
        <div class="index-view__actions">
          <common-button
            @click="pollStore.saveAnswers()"
            alignment="stretch"
          >
            Завершить опрос
          </common-button>
        </div>
      </template>
      <template #content>
        <div class="index-view__poll-form">
          <poll-form
            :questions="pollStore.poll.questions"
            v-model:answers="pollStore.answers"
          />
        </div>
      </template>
    </the-sidebar-layout>
  </div>
</template>

<script setup lang="ts">
import pollForm from '../components/poll-form.vue'
import { usePollStore } from '../stores/poll'

const pollStore = usePollStore()

pollStore.fetchPoll()
</script>

<style scoped lang="sass">
.index-view

  &__header
    margin-bottom: 1em
    margin-top: -1em

    h1
      margin: 0

  &__description
    margin-bottom: 3em
    color: var(--text-light)
    white-space: pre-wrap
</style>
