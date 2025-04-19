<template>
  <div class="word-counter">
    Количество слов:
    <b>{{ wordCount }}</b>
    <explanation-tooltip title="Как считаются слова?">
      <div class="modal-content">
        <p>
          Служебные части речи (предлоги, союзы, частицы) считаются, как
          отдельные слова. Например, все же - 2 слова; в доме - 2 слова.
        </p>
        <p>
          Слова, написанные через дефис, считаются, как одно слово. Например,
          все-таки - 1 слово; как-нибудь - 1 слово.
        </p>
        <p>
          Инициалы писателя + фамилия считаются, как одно слово, если они
          написаны без пробелов. Например, М.Ю.Лермонтов - 1 слово; Михаил
          Юрьевич Лермонтов - 3 слова.
        </p>
        <p>
          Символы и цифры не учитываются при подсчете. Например, 10 лет - 1
          слово; десять лет - 2 слова.
        </p>
        <p>
          Слова в цитате считаются так же, как обычные слова. Например, Татьяна
          говорит: "Но я другому отдана" - 6 слов.
        </p>
      </div>
    </explanation-tooltip>
  </div>
</template>

<script setup lang="ts">
import type { DeltaContentType } from '@/types/richtext/DeltaContentType'
import { computed, watch } from 'vue'

interface Props {
  value: DeltaContentType
  wordCount: number
}

interface Emits {
  (e: 'update:wordCount', value: number): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const wordCountModel = computed({
  get: () => props.wordCount,
  set: (value) => emits('update:wordCount', value)
})

watch(
  () => props.value,
  (value) => {
    wordCountModel.value = wordCounter(value)
  },
  { immediate: true }
)

/**
 * Count words in a delta
 * - do not count numbers
 * - do not count punctuation
 */
function wordCounter(value: DeltaContentType) {
  const text = toText(value.ops)
    .replace('\n', ' ')
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
  const words = text.split(' ').filter((word) => isNaN(Number(word)))
  return words.length
}

function toText(ops: DeltaContentType['ops']): string {
  let result = ''

  for (const op of ops) {
    result += op.insert
  }

  return result
}
</script>

<style scoped lang="sass">
.word-counter
	color: var(--text-light)

	b
		color: var(--form-text-color)

.modal-content
	padding-bottom: 1em
	color: var(--text-light)
</style>
