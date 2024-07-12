<template>
  <teleport to="body">
    <div
      class="sure-modal"
      :class="{ 'sure-modal--visible': visible }"
      v-auto-animate
    >
      <div
        class="sure-modal__inner"
        v-if="visible"
        @click.self="onCancel"
      >
        <div class="sure-modal__container">
          <div class="sure-modal__title">
            <slot name="title" />
          </div>
          <div class="sure-modal__text">
            <slot name="text" />
          </div>
          <div class="sure-modal__buttons">
            <common-button
              alignment="stretch"
              @click="onCancel"
              design="secondary"
              class="sure-modal__buttons__cancel"
            >
              Отмена
            </common-button>
            <common-button
              alignment="stretch"
              @click="onConfirm"
              design="primary"
              class="sure-modal__buttons__confirm"
            >
              Подтвердить
            </common-button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
interface Props {
  visible?: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

defineProps<Props>()
const emits = defineEmits<Emits>()

const onCancel = () => {
  emits('update:visible', false)
  emits('cancel')
}

const onConfirm = () => {
  emits('confirm')
  emits('update:visible', false)
}
</script>

<style scoped lang="sass">
.sure-modal
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: rgba(0, 0, 0, 0.5)
  z-index: 1000
  visibility: hidden
  z-index: 999

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
