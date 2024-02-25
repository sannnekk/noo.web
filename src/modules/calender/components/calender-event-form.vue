<template>
  <div class="calender-event-form">
    <div class="calender-event-form__header">
      <h2 class="calender-event-form__header__title">
        Создать событие на {{ currentDate }}
      </h2>
    </div>
    <div class="calender-event-form__body">
      <div class="calender-event-form__body__form">
        <div class="form-row">
          <div class="form-group form-group--input">
            <text-input
              placeholder="Название"
              type="text"
              v-model="eventModel.title"
            />
          </div>
          <div class="form-group form-group--button">
            <common-button
              primary
              @click="$emit('submit')"
            >
              Создать
            </common-button>
          </div>
        </div>
        <div class="form-group from-group--textarea">
          <text-area
            v-model="eventModel.description"
            placeholder="Описание"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDate } from '@/composables/useDate'
import type { CalenderEvent } from '@/types/composed/CalenderEvent'
import { computed } from 'vue'

interface Props {
  modelValue: Omit<CalenderEvent, 'id'>
}

interface Emits {
  (e: 'update:modelValue', value: Omit<CalenderEvent, 'id'>): void
  (e: 'submit'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const eventModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  }
})

const currentDate = computed(() =>
  useDate(eventModel.value.date, { precision: 'day' }).toBeautiful()
)
</script>

<style scoped lang="sass">
.calender-event-form
  &__header
    &__title
      font-weight: 500

  &__body
    &__form
      display: flex
      gap: 1rem
      flex-direction: column

      .form-row
        display: flex
        gap: 1rem
        flex-direction: row

        .form-group
          &--input
            flex: 1
            font-size: 14px

            &:deep() input
              padding: 0.7em 1.3em

          &--button
            :deep()
              button
                font-size: 14px
                width: 100%
                padding: 0.6em 2em

      .form-group
        label
          display: block
          margin-bottom: 0.5rem
          font-weight: 500
          font-size: 14px
</style>
@/core/data/entities/CalenderEvent
