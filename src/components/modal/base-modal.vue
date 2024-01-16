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
            class="base-modal__title"
            :class="`base-modal__title--${type}`"
          >
            {{
              type === 'success'
                ? 'Успешно'
                : type === 'error'
                ? 'Ошибка'
                : 'Внимание'
            }}
          </div>
          <div class="base-modal__text">
            {{ message }}
          </div>
          <div class="base-modal__buttons">
            <common-button
              alignment="stretch"
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
  message: string
  type: 'success' | 'error' | 'warning'
  visible?: boolean
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
    width: 90%
    max-width: 500px
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
    font-size: 1.2em
    font-weight: 500
    margin-bottom: 0.5em

    &--success
      color: var(--success)

    &--error
      color: var(--danger)

    &--warning
      color: var(--warning)

  &__text
    margin-bottom: 1em
    color: var(--text-light)

  &__buttons
    display: flex
    flex-direction: row
    justify-content: space-between

    &__cancel
      margin-right: 0.5em
</style>
