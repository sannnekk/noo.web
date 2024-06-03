<template>
  <label>{{ label }}</label>
  <div class="tag-input">
    <div class="tag-input__tags">
      <span
        class="tag-input__tag"
        v-for="(tag, index) in model"
        :key="index"
      >
        {{ tag }}
        <b
          class="tag-input__tag__remove"
          @click="removeTag(index)"
          >+</b
        >
      </span>
    </div>
    <input
      type="text"
      v-model="input"
      @keydown.enter.prevent="addTag()"
      @keydown.backspace="removeLastTag()"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  label: string
  modelValue: string[] | string
  separator?: string | undefined
}

interface Emits {
  (event: 'update:modelValue', value: string[] | string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const model = computed<string[]>({
  get: () => {
    if (props.separator) {
      if (props.modelValue === '' || !props.modelValue) {
        return []
      }

      return (<string>props.modelValue).split(props.separator)
    }

    return props.modelValue as string[]
  },
  set: (value: string[]) => {
    if (props.separator) {
      emit('update:modelValue', value.join(props.separator))
    } else {
      emit('update:modelValue', value)
    }
  }
})

const input = ref('')

function addTag() {
  if (input.value && input.value.trim()) {
    model.value = [...model.value, input.value.trim()]
    input.value = ''
  }
}

function removeTag(index: number) {
  model.value = model.value.filter((_, i) => i !== index)
}

function removeLastTag() {
  if (input.value === '' && model.value.length > 0) {
    removeTag(model.value.length - 1)
  }
}
</script>

<style scoped lang="sass">
label
  font-size: 0.8em
  color: var(--text-light)

.tag-input
  display: flex
  flex-wrap: wrap
  gap: 0.5rem
  border: 1px solid var(--border-color)
  border-radius: var(--border-radius)
  padding: 0.5rem 0.8rem

  &__tags
    display: flex
    flex-wrap: wrap
    gap: 0.5rem

    &--empty
      display: none

  &__tag
    background-color: var(--lila)
    color: var(--lightest)
    padding: 0.1em 2em 0.1em 0.5em
    border-radius: 0.25rem
    cursor: pointer
    position: relative
    font-size: 0.8em

    &__remove
      margin-left: 0.5rem
      font-weight: normal
      font-size: 1.8em
      line-height: 0
      position: absolute
      top: 50%
      right: 5px
      transform: translateY(-50%) rotate(45deg)
      color: var(--dark)
      cursor: pointer

      &:hover
        color: var(--lightest)

  input
    border: none
    padding: 0
    outline: none
    flex: 1
    color: var(--form-text-color)
    background-color: transparent
</style>
