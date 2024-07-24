<template>
  <div class="profile-credentials">
    <div class="profile-credentials__avatar">
      <user-avatar
        :src="credentialsModel.telegramAvatarUrl"
        :name="credentialsModel.name"
      />
    </div>
    <div class="profile-credentials__online-status">
      <online-status
        :is-online="credentialsModel.isOnline"
        :last-seen="credentialsModel.lastRequestAt"
        :is-mobile="credentialsModel.isLastRequestMobile"
      />
    </div>
    <div class="profile-credentials__name">
      <form-input
        type="text"
        label="Имя"
        @update:modelValue="onSomeInputChange()"
        v-model="credentialsModel.name"
        class="input"
      />
    </div>
    <div class="profile-credentials__username">
      <form-input
        label="Никнейм"
        type="text"
        v-model="credentialsModel.username"
        class="input"
        readonly
      />
    </div>
    <div class="profile-credentials__email">
      <form-input
        label="Email"
        type="text"
        readonly
        @update:modelValue="onSomeInputChange()"
        v-model="credentialsModel.email"
        class="input"
      />
      <span
        class="profile-credentials__email__change"
        v-if="!credentialsModel.newEmail"
      >
        <inline-icon
          name="edit"
          @click="$emit('change-email')"
        />
      </span>
      <div
        v-else
        class="profile-credentials__email__change-requested"
      >
        <warning-block>
          <p>
            На почту <b>{{ credentialsModel.newEmail }}</b> отправлено письмо с
            подтверждением смены почты. Пожалуйста, проверьте почту и
            подтвердите новый адрес.
          </p>
        </warning-block>
      </div>
    </div>
    <div class="profile-credentials__role">
      <role-tag :role="credentialsModel.role" />
    </div>
    <div
      class="profile-credentials__save-button"
      v-auto-animate
    >
      <common-button
        v-if="isChanged"
        alignment="center"
        @click="$emit('save')"
      >
        Сохранить
      </common-button>
    </div>
    <div class="profile-credentials__telegram">
      <p v-if="credentialsModel.telegramId">
        К этому аккаунту привязан Telegram:
        {{ credentialsModel.telegramUsername }}
      </p>
      <common-button
        design="telegram"
        alignment="stretch"
        v-if="credentialsModel.telegramId === null"
        @click="$emit('add-telegram')"
      >
        Привязать Telegram
      </common-button>
      <common-button
        design="telegram"
        alignment="stretch"
        v-else
        @click="$emit('remove-telegram')"
      >
        Отвязать Telegram
      </common-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User, UserWithOnlineStatus } from '@/core/data/entities/User'
import { ref, computed } from 'vue'

interface Props {
  modelValue: UserWithOnlineStatus
}

interface Emits {
  (e: 'update:modelValue', value: User): void
  (e: 'save'): void
  (e: 'add-telegram'): void
  (e: 'remove-telegram'): void
  (e: 'change-email'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const credentialsModel = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
})

const isChanged = ref(false)

function onSomeInputChange() {
  isChanged.value = true
}
</script>

<style scoped lang="sass">
.profile-credentials
  text-align: center

  .label
    display: block
    margin-top: 0.5em

  .sub-label
    display: block
    font-size: 0.8em
    color: var(--text-light)

  .input
    width: 100%

    &:deep()
      input
        text-align: center

  &__avatar
    display: inline-block
    font-size: 180px

  &__online-status
    margin-top: 0.6em
    margin-bottom: 1em

    > div
      justify-content: center

  &__name
    margin-top: 1em

    &:deep()

      input
        font-weight: 500
        font-size: 1.2em
        text-align: center

  &__username
    margin-top: 0.5em

    input
      text-align: center

  &__role
    margin-top: 0.5em

  &__save-button
    margin-top: 1em
    margin-bottom: 1em

  &__email
    margin-top: 0.5em
    position: relative

    input
      text-align: center

    &__change
      display: block
      position: absolute
      bottom: 0.25em
      right: 0.4em
      cursor: pointer

      &:hover
        --form-text-color: var(--warning) !important

    &__change-requested
      font-size: 0.7em
      padding-top: 0.4em

      > *
        padding: 0.2em 0.6em

  &__telegram
    margin-top: 0.5em

    p
      font-size: 0.8em
</style>
