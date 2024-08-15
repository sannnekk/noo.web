<template>
  <div class="create-snippet-form">
    <div class="create-snippet-form__name">
      <form-input
        v-model="model.name"
        label="Название сниппета"
        type="text"
        :validators="[
					(value) => (value as string).length > 0 || 'Название сниппета должно содержать хотя бы 1 символ',
					(value) => (value as string).length <= 50 || 'Название сниппета не должно превышать 50 символов',
				]"
      />
    </div>
    <div class="create-snippet-form__content">
      <rich-text-area
        label="Сниппет"
        v-model="model.content"
      />
    </div>
    <div class="create-snippet-form__actions">
      <common-button
        @click="$emit('create-snippet', model)"
        alignment="right"
        design="primary"
      >
        Создать сниппет
      </common-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { Snippet } from '@/core/data/entities/Snippet'
import { emptyDelta } from '@/core/utils/deltaHelpers'
import { ref } from 'vue'

interface Emits {
  (event: 'create-snippet', snippet: Omit<Snippet, 'id'>): void
}

defineEmits<Emits>()

const model = ref<Omit<Snippet, 'id'>>({
  name: '',
  content: emptyDelta(),
  userId: Core.Context.User!.id
})
</script>

<style lang="sass" scoped>
.create-snippet-form
	&__name
		margin-bottom: 1em

	&__content
		margin-bottom: 1em
</style>
