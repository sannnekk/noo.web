<template>
  <div class="create-subject-form">
    <div class="row">
      <div class="col-md-6 col-12">
        <div class="create-subject-form__form-field">
          <form-input
            v-model="subjectModel.name"
            type="text"
            label="Название предмета"
            :validators="[
							(value: any) => (value as string).length > 2 || 'Название предмета должно содержать минимум 3 символа',
							(value: any) => (value as string).length < 101|| 'Название предмета должно содержать максимум 100 символов'
						]"
          />
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="create-subject-form__form-field">
          <form-input
            type="color"
            v-model="subjectModel.color"
            label="Цвет предмета"
          />
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="create-subject-form__actions">
          <common-button
            @click="onSubmit()"
            alignment="stretch"
            design="primary"
          >
            Создать
          </common-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Subject } from '@/core/data/entities/Subject'
import { ref } from 'vue'

interface Emits {
  (event: 'create-subject', subject: Omit<Subject, 'id'>): void
}

const emits = defineEmits<Emits>()

const subjectModel = ref<Omit<Subject, 'id'>>({
  name: '',
  color: ''
})

function onSubmit() {
  emits('create-subject', subjectModel.value)
}
</script>

<style scoped lang="sass">
.create-subject-form
	&__actions
		height: 100%
		display: flex
		align-items: flex-end
</style>
