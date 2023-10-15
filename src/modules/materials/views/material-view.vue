<template>
  <div
    class="material-view"
    v-if="material"
  >
    <div class="material-view__header">
      <div class="material-view__header__title">
        <h1>{{ material!.name }}</h1>
      </div>
      <div
        class="material-view__header__work-link"
        v-if="material?.workId"
      >
        <common-button :to="material?.work?.slug">
          Перейти к работе
        </common-button>
      </div>
    </div>
    <div class="material-view__description">
      <div v-html="material!.description"></div>
    </div>
    <div class="material-view__content">
      <div v-html="material!.content"></div>
    </div>
  </div>
  <p
    class="no-material-selected"
    v-else
  >
    Выберите материал из дерева слева
  </p>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useMaterialsStore } from '../stores/materials'
import { computed } from 'vue'

const materialsStore = useMaterialsStore()
const route = useRoute()

const material = computed(() =>
  materialsStore.getMaterialBySlug(
    route.params.courseId as string,
    route.params.slug as string
  )
)

console.log(material)
</script>

<style scoped lang="sass">
.material-view
  &__header
    width: 100%
    display: flex
    justify-content: space-between
    align-items: center

    &__title
      flex: 1

    &__work-link
      .v-button:deep()
        button
          font-size: 1.05em

  &__description
    padding: 1rem
    margin-right: 1rem
    border-radius: var(--border-radius)
    border: 1px solid var(--secondary)
    background: var(--secondary)
    margin-bottom: 1rem

  &__content:deep()
    padding-right: 1em

    iframe
      width: 100%
      aspect-ratio: 16 / 9
      border-radius: var(--border-radius)
</style>
