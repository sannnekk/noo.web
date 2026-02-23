<template>
  <div class="change-background-form">
    <div class="change-background-form__change">
      <file-input
        label="Выбрать фон"
        v-model="backgroundMediaModel"
        :max-count="1"
        :allowed-mime-types="['image/png', 'image/jpeg']"
      />
    </div>
    <p>Фоновое изображение отобразится после перезагрузки страницы</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePersonalizationStore } from '../../stores/personalization'
import type { Media } from '@/core/data/entities/Media'

const personalizationStore = usePersonalizationStore()

const backgroundMediaModel = computed<Media[]>({
  get: () => {
    return personalizationStore.settings!.backgroundImage
      ? [personalizationStore.settings!.backgroundImage]
      : []
  },
  set: (value) => {
    if (value.length) {
      personalizationStore.settings!.backgroundImage = value[0]
    } else {
      personalizationStore.settings!.backgroundImage = null
    }

    personalizationStore.changeSettings()
  }
})
</script>

<style scoped lang="sass">
.change-background-form
	p
		color: var(--text-light)
</style>
