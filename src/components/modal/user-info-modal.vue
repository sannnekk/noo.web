<template>
  <teleport to="body">
    <div
      class="user-info-modal"
      :class="{ 'user-info-modal--visible': visible }"
      v-auto-animate
    >
      <div
        class="user-info-modal__inner"
        v-if="visible"
        @click.self="onClose()"
      >
        <div class="user-info-modal__container">
          <div class="user-info-modal__title">
            <span>{{ user.name }}</span>
          </div>
          <div class="user-info-modal__content">
            <div class="user-info-modal__content__image">
              <div class="user-info-modal__content__image__avatar">
                <user-avatar :name="user.name" />
              </div>
              <div
                class="user-info-modal__content__image__telegram"
                v-if="user.telegramUsername"
              >
                <telegram-button :username="user.telegramUsername" />
              </div>
            </div>
            <div class="user-info-modal__content__text">
              <div class="user-info-modal__content__text__item">
                <span>Имя:</span>
                <b>{{ user.name }}</b>
              </div>
              <div class="user-info-modal__content__text__item">
                <span>Никнейм:</span>
                <b>{{ user.username }}</b>
              </div>
              <div class="user-info-modal__content__text__item">
                <span>Email:</span>
                <b>{{ user.email }}</b>
              </div>
              <div
                class="user-info-modal__content__text__item user-info-modal__content__text__item--role"
              >
                <role-tag :role="user.role" />
              </div>
            </div>
          </div>
          <div class="user-info-modal__buttons">
            <common-button
              alignment="stretch"
              @click="onClose()"
              design="secondary"
              class="user-info-modal__buttons__cancel"
            >
              Закрыть
            </common-button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import type { User } from '@/core/data/entities/User'

interface Props {
  user: User
  visible: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

function onClose() {
  emits('update:visible', false)
}
</script>

<style scoped lang="sass">
.user-info-modal
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: rgba(0, 0, 0, 0.5)
  z-index: 1000
  visibility: hidden

  &--visible
    visibility: visible

  &__inner
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(0, 0, 0, 0.5)
    display: flex
    justify-content: center
    align-items: center

  &__container
    background-color: var(--lightest)
    border-radius: var(--border-radius)
    padding: 1em
    width: 90%
    max-width: 600px
    max-height: 90%
    overflow-y: auto

    &::-webkit-scrollbar
      width: 0.5em

    &::-webkit-scrollbar-track
      background-color: var(--background)

    &::-webkit-scrollbar-thumb
      background-color: var(--border-color)
      border-radius: var(--border-radius)

  &__title
    font-size: 1.5em
    font-weight: bold
    margin-bottom: 0.5em

    &--success
      color: var(--success)

    &--error
      color: var(--danger)

    &--warning
      color: var(--warning)

  &__content
    display: flex
    flex-direction: row
    align-items: center
    gap: 1em
    margin-bottom: 1em

    @media screen and (max-width: 768px)
      flex-direction: column

    &__image
      flex: 0 0 170px

      &__avatar
        font-size: 170px

      &__telegram
        margin-top: 1em
        font-size: 0.8em

    &__text
      flex: 1
      display: flex
      flex-direction: column
      gap: 0.5em
      padding: 1em
      color: var(--text-light)

      b
        color: var(--dark)
        font-weight: normal

      &__item
        display: flex
        flex-direction: row
        justify-content: space-between
        width: 100%

        &--role
          margin-top: 1em
          display: block
          text-align: center

  &__buttons
    display: flex
    flex-direction: row
    justify-content: space-between

    &__cancel
      margin-right: 0.5em
</style>
