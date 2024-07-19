<template>
  <div class="session-card">
    <!-- <div class="session-card__icon">
      <inline-icon :name="iconName" />
    </div> -->
    <div class="session-card__title">
      <h4>
        {{ device }}, {{ browser }}
        <span
          class="session-card__is-current"
          v-if="isCurrent"
        >
          Это устройство
        </span>
      </h4>
    </div>
    <div class="session-card__details">
      <div class="session-card__details__item">
        Браузер:
        <span>
          {{ browser }}
        </span>
      </div>
      <div
        class="session-card__details__item"
        v-if="os"
      >
        Система:
        <span>
          {{ os }}
        </span>
      </div>
      <div class="session-card__details__item">
        Последняя активность:
        <span>
          {{ useDate(lastRequestAt, { precision: 'minute' }).toBeautiful() }}
        </span>
      </div>
      <div class="session-card__details__item">
        Вход:
        <span>
          {{ useDate(createdAt, { precision: 'minute' }).toBeautiful() }}
        </span>
      </div>
    </div>
    <div class="session-card__actions">
      <common-button
        design="warning"
        @click="$emit('delete-session', id)"
        alignment="center"
      >
        Выйти
      </common-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDate } from '@/composables/useDate'
import type { Session } from '@/core/data/entities/Session'

interface Emits {
  (e: 'delete-session', sessionId: Session['id']): void
}

defineProps<Session>()
defineEmits<Emits>()
</script>

<style scoped lang="sass">
.session-card
  display: flex
  flex-direction: column
  padding: 20px
  border-radius: 8px
  background-color: var(--color-background)
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)

  @media (max-width: 768px)
    width: 100%

  &__icon
    display: flex
    justify-content: center
    font-size: 3em
    margin: 1em 0

  &__title
    font-size: 1.5em
    text-align: center

    h4
      margin: 0.2em 0 0.6em 0

  &__is-current
    display: inline-block
    font-size: 0.6em
    font-weight: normal
    color: var(--white)
    background: var(--success)
    padding: 0.1em 0.6em
    border-radius: var(--border-radius)

  &__details
    display: flex
    flex-direction: column
    gap: 10px
    font-size: 14px

    &__item
      display: flex
      justify-content: space-between
      gap: 0.3em

      span
        font-weight: 700

  &__actions
    display: flex
    justify-content: center
    margin-top: 1em
</style>
