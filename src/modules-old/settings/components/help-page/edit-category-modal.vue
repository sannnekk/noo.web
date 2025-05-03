<template>
  <base-modal
    type="info"
    v-model:visible="visiilityModel"
    title="Редактирование категории"
    :actions="[{ label: 'Сохранить', design: 'primary', handler: onConfirm }]"
  >
    <div class="edit-category-modal">
      <div class="edit-category-modal__form">
        <div class="edit-category-modal__form__field">
          <form-input
            v-model="category.name"
            label="Название"
            type="text"
          />
        </div>
        <div class="edit-category-modal__form__field">
          <category-select v-model:category="category.parentCategory" />
        </div>
        <div
          class="edit-category-modal__form__error"
          v-if="error"
        >
          <error-block>
            {{ error }}
          </error-block>
        </div>
      </div>
    </div>
  </base-modal>
</template>

<script setup lang="ts">
import categorySelect from './category-select.vue'
import type { FAQCategory } from '@/core/data/entities/FAQCategory'
import { computed, ref, watch } from 'vue'

interface Props {
  visible: boolean
  category: FAQCategory
}

interface Emits {
  (event: 'update:visible', value: boolean): void
  (event: 'confirm', value: FAQCategory): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const visiilityModel = computed({
  get: () => props.visible,
  set: (value: boolean) => emits('update:visible', value)
})

const category = ref(props.category)

watch(
  () => props.category,
  (value) => {
    category.value = value
  }
)

const error = ref('')

function onConfirm() {
  if (!category.value.parentCategory) {
    error.value = 'Выберите категорию'
    return
  } else {
    error.value = ''
  }

  emits('confirm', category.value)
}
</script>

<style scoped lang="sass">
.edit-category-modal
	&__form
		padding: 1em 0
</style>
