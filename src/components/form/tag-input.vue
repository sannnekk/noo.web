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
        >
          +
        </b>
      </span>
    </div>
    <input
      type="text"
      v-model="input"
      @keydown.enter.prevent="confirmInput()"
      @keydown.backspace="removeLastTag()"
      @keydown.down.prevent="moveHighlight(1)"
      @keydown.up.prevent="moveHighlight(-1)"
      @keydown.esc="closeSuggestions()"
      @focus="suggestionsVisible = true"
      @blur="closeSuggestions()"
    />
    <ul
      class="tag-input__suggestions"
      v-if="suggestionsVisible && filteredSuggestions.length"
    >
      <li
        class="tag-input__suggestion"
        :class="{
          'tag-input__suggestion--highlighted': index === highlightedIndex
        }"
        v-for="(suggestion, index) in filteredSuggestions"
        :key="suggestion"
        @mousedown.prevent="addTag(suggestion)"
        @mouseenter="highlightedIndex = index"
      >
        {{ suggestion }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const MAX_VISIBLE_SUGGESTIONS = 8

interface Props {
  label: string
  modelValue: string[] | string
  separator?: string | undefined
  suggestions?: string[]
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

      return (props.modelValue as string).split(props.separator)
    }

    return (props.modelValue as string[]) || []
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

const suggestionsVisible = ref(false)
const highlightedIndex = ref(-1)

/**
 * Suggestions that are not added yet and match the current input
 */
const filteredSuggestions = computed<string[]>(() => {
  const needle = input.value.trim().toLowerCase()
  const added = model.value.map((tag) => tag.toLowerCase())

  return (props.suggestions || [])
    .filter(
      (suggestion) =>
        !added.includes(suggestion.toLowerCase()) &&
        suggestion.toLowerCase().includes(needle)
    )
    .slice(0, MAX_VISIBLE_SUGGESTIONS)
})

watch(filteredSuggestions, () => (highlightedIndex.value = -1))

/**
 * Add the highlighted suggestion or, if there is none, the typed text
 */
function confirmInput() {
  addTag(filteredSuggestions.value[highlightedIndex.value] ?? input.value)
}

function addTag(tag: string) {
  if (tag && tag.trim()) {
    model.value = [...model.value, tag.trim()]
    input.value = ''
    highlightedIndex.value = -1
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

function moveHighlight(delta: number) {
  const count = filteredSuggestions.value.length

  if (!count) {
    return
  }

  suggestionsVisible.value = true

  // the position 0 means "nothing highlighted, use the typed text"
  const position = highlightedIndex.value + 1
  const nextPosition = (position + delta + count + 1) % (count + 1)

  highlightedIndex.value = nextPosition - 1
}

function closeSuggestions() {
  suggestionsVisible.value = false
  highlightedIndex.value = -1
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
  position: relative

  &__suggestions
    position: absolute
    top: calc(100% + 0.2rem)
    left: 0
    right: 0
    z-index: 10
    margin: 0
    padding: 0.2rem 0
    list-style: none
    max-height: 200px
    overflow-y: auto
    background: var(--form-background)
    border: 1px solid var(--border-color)
    border-radius: var(--border-radius)
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1)

  &__suggestion
    padding: 0.3em 0.8em
    cursor: pointer
    font-size: 0.9em
    color: var(--form-text-color)

    &--highlighted
      background-color: var(--lila)
      color: var(--lightest)

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
