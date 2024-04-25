<template>
  <teleport to="body">
    <div
      class="base-modal"
      :class="{ 'base-modal--visible': visible }"
      v-auto-animate
    >
      <div
        class="base-modal__inner"
        v-if="visible"
        @click.self="onClose()"
      >
        <div class="base-modal__container">
          <div
            class="base-modal__error-img"
            v-if="type === 'error'"
          >
            <img
              src="/img/error.svg"
              alt="Ошибка"
            />
          </div>
          <div
            class="base-modal__title"
            :class="`base-modal__title--${type}`"
          >
            <span v-if="title">{{ title }}</span>
          </div>
          <div
            class="base-modal__text"
            :class="`base-modal__text--${type}`"
          >
            {{ message || '' }}
          </div>
          <slot />
          <div
            class="base-modal__buttons"
            :class="{
              'base-modal__buttons--horizontal': type === 'error'
            }"
          >
            <common-button
              v-for="(action, index) in actions"
              :key="index"
              alignment="stretch"
              :design="action.design"
              @click="onActionClick(action.handler)"
            >
              {{ action.label }}
            </common-button>
            <common-button
              :alignment="type === 'error' ? 'right' : 'stretch'"
              @click="onClose"
              design="secondary"
              class="base-modal__buttons__cancel"
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
interface Props {
  title?: string
  message?: string
  type: 'success' | 'error' | 'warning'
  visible?: boolean
  actions?: Array<{
    label: string
    design: 'primary' | 'secondary' | 'danger' | 'warning'
    handler: () => void | Promise<void>
  }>
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

function onClose() {
  emits('update:visible', false)
}

function onActionClick(handler: () => void | Promise<void>) {
  const result = handler()

  if (result instanceof Promise) {
    result.then(onClose)
  } else {
    onClose()
  }
}
</script>

<style scoped lang="sass">
.base-modal
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
    width: min(95%, 700px)
    max-height: 90%
    overflow-y: auto

    &::-webkit-scrollbar
      width: 0.5em

    &::-webkit-scrollbar-track
      background-color: var(--background)

    &::-webkit-scrollbar-thumb
      background-color: var(--border-color)
      border-radius: var(--border-radius)

  &__error-img
    img
      width: 89%
      height: auto
      margin-left: 5%
      margin-top: 1em

  &__title
    font-size: 1.2em
    font-weight: 500
    margin-bottom: 0.5em

    &--success
      color: var(--success)

    &--error
      color: var(--danger)
      text-align: center

    &--warning
      color: var(--warning)

  &__text
    margin-bottom: 1em
    color: var(--text-light)

    &--error
      text-align: center

  &__buttons
    display: flex
    flex-direction: column
    justify-content: space-between
    gap: 0.5em

    &--horizontal
      flex-direction: row

    &__cancel
      margin-right: 0.5em
</style>
