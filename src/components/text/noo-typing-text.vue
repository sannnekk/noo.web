<template>
  <typed
    :options="options"
    v-if="shouldRender"
  >
    <span class="typing"></span>
  </typed>
</template>

<script lang="ts" setup>
import { Typed } from '@duskmoon/vue3-typed-js'
import type { TypedOptions } from '@duskmoon/vue3-typed-js'
import { computed, nextTick, type ComputedRef, ref, watch } from 'vue'

interface Props {
  words: string[]
  speed: number
}

const props = defineProps<Props>()

/**
 * This is a workaround for a bug in vue3-typed-js.
 * It requires the rerender of the text to work properly if the options change
 */
const shouldRender = ref(true)

const options: ComputedRef<TypedOptions> = computed(() => {
  return {
    strings: props.words,
    typeSpeed: props.speed,
    loop: true,
    smartBackspace: true
  }
})

watch(options, () => {
  shouldRender.value = false
  nextTick(() => {
    shouldRender.value = true
  })
})
</script>
