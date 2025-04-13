<template>
  <div
    class="quill-prompt"
    v-auto-animate
  >
    <div
      class="quill-prompt__inner"
      v-if="visibilityModel"
    >
      <div class="quill-prompt__label">
        <label>{{ label }}</label>
      </div>
      <div class="quill-prompt__field">
        <input
          type="url"
          v-model="input"
          @keypress.enter="onOk()"
        />
      </div>
      <div class="quill-prompt__actions">
        <button
          class="quill-prompt__actions__ok"
          @click="onOk()"
        >
          Ок
        </button>
        <button
          class="quill-prompt__actions__cancel"
          @click="onCancel()"
        >
          Отмена
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

interface Props {
  action: (value: any) => void | Promise<void>
  label: string
  visible?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const input = ref('')
const visibilityModel = computed({
  get: () => props.visible,
  set: (value) => emits('update:visible', value)
})

async function onOk() {
  const result = props.action(input.value)

  if (result instanceof Promise) {
    await result
  }

  visibilityModel.value = false
  input.value = ''
}

function onCancel() {
  visibilityModel.value = false
  input.value = ''
}
</script>

<style lang="sass" scoped>
.quill-prompt
  overflow: hidden

  &__inner
    display: flex
    align-items: center
    padding: 0.5em
    gap: 0.5em
    border-bottom: 1px solid var(--border-color)

  &__label
    font-size: 0.9em

  &__field
    flex: 1

    input
      width: 100%
      overflow-y: auto
      resize: none
      padding: 0.5em
      border: 1px solid var(--border-color)
      border-radius: var(--border-radius)
      background: var(--form-background)
      color: var(--form-text-color)

      &:focus
        outline: none
        border-color: var(--primary)

  &__actions
    display: flex
    justify-content: flex-end

    &__ok, &__cancel
      border: 1px solid transparent
      border-radius: var(--border-radius)
      cursor: pointer
      font-size: 0.9em
      margin-left: 0.5em
      padding: 0.25em 0.5em

    &__ok
      border-color: var(--secondary)
      background-color: var(--secondary)
      color: var(--form-text-color)

      &:hover
        background-color: transparent
        color: var(--form-text-color)

    &__cancel
      border-color: var(--dark)
      background-color: var(--dark)
      color: var(--white)

      &:hover
        background-color: var(--border-color)
        color: var(--dark)
</style>
