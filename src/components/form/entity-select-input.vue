<template>
  <label>{{ label }}</label>
  <div
    class="entity-select-input"
    v-auto-animate
    @focusin="focus.input = true"
    @focusout="focus.input = false"
  >
    <div
      class="entity-select-input__selected"
      v-if="model.length"
    >
      <span
        class="entity-select-input__selected__item"
        v-for="(entity, index) in model"
        :key="index"
      >
        <span>
          {{ getLabel(entity) }}
        </span>
        <b
          class="entity-select-input__selected__item__remove"
          @click="removeItem(index)"
        >
          +
        </b>
      </span>
    </div>
    <div class="entity-select-input__input">
      <input
        type="text"
        v-model="pagination.search"
        @keydown.enter.prevent="addItem()"
        @keydown.backspace="removeLastItem()"
        @keydown.down.prevent="onArrowDown()"
        @keydown.up.prevent="onArrowUp()"
      />
    </div>
    <div
      class="entity-select-input__flyout"
      v-if="flyoutVisible"
      @focusin="focus.flyout = true"
      @focusout="focus.flyout = false"
    >
      <ul
        v-if="!isListLoading"
        class="entity-select-input__flyout__results"
      >
        <li
          class="entity-select-input__flyout__results__item"
          :class="{
            'entity-select-input__flyout__results__item--hovered': hoveredItemId === (item as any).id,
          }"
          v-for="item in results.slice(0, 5)"
          :key="(item as any).id"
          @click="addItem()"
          @mouseenter="hoveredItemId = (item as any).id"
        >
          {{ getLabel(item) }}
        </li>
      </ul>
      <div
        class="entity-select-input__flyout__loading"
        v-else
      >
        <loader-icon contrast />
        <span> Загрузка... </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSearch } from '@/composables/useSearch'
import { computed, reactive, ref, watch } from 'vue'

interface Props {
  label: string
  fetchFunction: Parameters<typeof useSearch>[0]
  maxCount: number
  modelValue: any
  labelKeys: string[]
}

interface Emits {
  (event: 'update:modelValue', value: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const focus = reactive({
  input: false,
  flyout: false
})

const flyoutVisible = ref(false)
const hoveredItemId = ref(null)

const { pagination, results, isListLoading } = useSearch(props.fetchFunction, {
  immediate: false
})

watch(
  results,
  () => {
    if (results.value.length === 0 || isListLoading.value) {
      hoveredItemId.value = null
    }

    hoveredItemId.value = (results.value[0] as any)?.id || null
    flyoutVisible.value =
      (focus.input || focus.flyout) && pagination.value.search !== ''
  },
  { deep: true }
)

watch(
  focus,
  () => {
    setTimeout(() => {
      flyoutVisible.value =
        (focus.input || focus.flyout) && pagination.value.search !== ''
    }, 250)
  },
  {
    deep: true
  }
)

function getLabel(item: any) {
  return props.labelKeys
    .map((key) => {
      if (key.includes('.')) {
        return key.split('.').reduce((acc, key) => {
          if (!acc) {
            return ''
          }

          return acc[key]
        }, item)
      }

      return item[key]
    })
    .join(' / ')
}

function addItem() {
  if (model.value.length >= props.maxCount) {
    return
  }

  const item = results.value.find(
    (result: any) => result.id === hoveredItemId.value
  )

  if (!item) {
    return
  }

  model.value = [...model.value, item]
  pagination.value.search = ''
}

function removeItem(index: number) {
  model.value = model.value.filter((_: any, i: number) => i !== index)
}

function removeLastItem() {
  if (pagination.value.search === '' && model.value.length > 0) {
    model.value = model.value.slice(0, model.value.length - 1)
  }
}

function onArrowDown() {
  const index = results.value.findIndex(
    (result: any) => result.id === hoveredItemId.value
  )

  if (index === -1 || index === results.value.length - 1) {
    return
  }

  hoveredItemId.value = (results.value[index + 1] as any).id
}

function onArrowUp() {
  const index = results.value.findIndex(
    (result: any) => result.id === hoveredItemId.value
  )

  if (index === -1 || index === 0) {
    return
  }

  hoveredItemId.value = (results.value[index - 1] as any).id
}
</script>

<style scoped lang="sass">
label
  font-size: 0.8em
  color: var(--text-light)

.entity-select-input
  display: flex
  flex-wrap: wrap
  gap: 0.5rem
  border: 1px solid var(--border-color)
  border-radius: var(--border-radius)
  background-color: var(--form-background)
  padding: 0.4em
  font-size: 0.9em

  &--focus
    border-color: var(--primary)

  &__selected
    display: flex
    flex-wrap: wrap
    gap: 0.5rem

    &--empty
      display: none

    &__item
      background-color: var(--lila)
      color: var(--lightest)
      padding: 0.1em 2em 0.1em 0.5em
      border-radius: 0.25rem
      cursor: pointer
      position: relative
      font-size: 0.9em
      white-space: nowrap
      font-weight: 500

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

  &__input
    position: relative
    flex: 1

    input
      border: none
      width: 100%
      padding: 0
      outline: none
      color: var(--form-text-color)
      background-color: transparent

      &:focus
        outline: none
        border: none

  &__flyout
    position: absolute
    z-index: 99
    top: calc(100% - 0.3em)
    width: calc(100% + 2px)
    left: -1px
    background-color: var(--lightest)
    border: 1px solid var(--border-color)
    border-top: none
    border-radius: 0 0 var(--border-radius) var(--border-radius)
    overflow: hidden

    &__results
      list-style: none
      padding: 0
      padding-top: 0.4em
      margin: 0

      &__item
        padding: 0.2em 0.5em
        cursor: pointer
        font-size: 0.8em

        &--hovered
          background-color: var(--border-color)

    &__no-results
      padding: 0.5rem

    &__loading
      padding: 0.5rem
</style>
