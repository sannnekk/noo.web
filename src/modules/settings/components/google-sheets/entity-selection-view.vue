<template>
  <div
    class="entity-selection-view"
    v-auto-animate
  >
    <section>
      <h4 class="entity-selection-view__header">Выберите модуль</h4>
      <div class="entity-selection-view__entity-list">
        <entity-selection-card
          v-for="entity in SupportedEntities"
          :key="entity.technicalName"
          :entity="entity"
          :selected="entity.technicalName === entityNameModel"
          @click="onEntitySelect(entity)"
        />
      </div>
    </section>
    <section
      class="entity-selection-view__header"
      v-if="chosenEntity"
    >
      <h4>Выберите селектор</h4>
      <div
        class="row"
        v-auto-animate
      >
        <div class="col-md-6">
          <div class="entity-selection-view__selector">
            <select-input
              label="Селектор"
              v-model="entitySelectorModel.prop"
              :options="chosenEntity?.availableSelectorProps"
            />
          </div>
        </div>
        <div class="col-md-6">
          <div
            class="entity-selection-view__selector"
            v-if="chosenSelector"
            :key="chosenSelector.value"
          >
            <entity-select-input
              label="Значение (только одно)"
              v-model="entitySelectorValueModel"
              :label-keys="chosenSelector.labelKeys"
              :fetch-function="chosenSelector.fetchFunction"
              :max-count="1"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import EntitySelectionCard from './entity-selection-card.vue'
import type { SupportedEntity } from '../../types/google-sheets/SupportedEntity'
import { computed, ref, watch } from 'vue'
import { SupportedEntities } from '../../data/google-sheets/SupportedEntities'

interface Props {
  entityName: string
  entitySelector: {
    prop: string
    value: string
  }
}

interface Emits {
  (event: 'update:entityName', value: string): void
  (event: 'update:entitySelector', value: Props['entitySelector']): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const chosenEntity = computed(() =>
  SupportedEntities.find((entity) => entity.technicalName === props.entityName)
)

const chosenSelector = computed(() =>
  chosenEntity.value?.availableSelectorProps.find(
    (selector) => selector.value === props.entitySelector.prop
  )
)

const entityNameModel = computed({
  get: () => props.entityName,
  set: (value: string) => emits('update:entityName', value)
})

const entitySelectorModel = computed({
  get: () => props.entitySelector,
  set: (value: Props['entitySelector']) => emits('update:entitySelector', value)
})

const entitySelectorValueModel = ref([])

watch(entitySelectorValueModel, () => {
  const value = entitySelectorValueModel.value?.at(0)

  entitySelectorModel.value = {
    prop: entitySelectorModel.value.prop,
    value: value ? chosenSelector.value?.toPropValue(value) : ''
  }
})

watch(chosenSelector, () => {
  entitySelectorValueModel.value = []
})

function onEntitySelect(entity: SupportedEntity) {
  entityNameModel.value = entity.technicalName
}
</script>

<style scoped lang="sass">
.entity-selection-view
  &__entity-list
    display: flex
    flex-wrap: wrap
    gap: 1em
</style>
