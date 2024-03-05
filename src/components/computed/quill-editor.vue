<template>
  <div ref="container"></div>
</template>

<script setup lang="ts">
import type { DeltaContentType } from '@/types/composed/DeltaContentType'
import Quill from 'quill'
import { Delta } from 'quill/core'
import 'quill/dist/quill.snow.css'
import { onMounted, ref } from 'vue'

interface Props {
  readonly?: boolean
  modelValue: DeltaContentType
}

interface Emits {
  (e: 'update:modelValue', value: DeltaContentType): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const container = ref<HTMLElement | null>(null)
let quill = null as Quill | null

onMounted(() => {
  quill = new Quill(container.value!, {
    theme: 'snow',
    readOnly: props.readonly,
    modules: props.readonly
      ? {}
      : {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons

            ['link', 'image', 'video'],

            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
            [{ header: [1, 2, false] }],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ align: [] }],

            ['clean']
          ]
        }
  })

  quill.setContents(new Delta(props.modelValue))
  quill.on('text-change', () => {
    emits('update:modelValue', quill!.getContents())
  })
})
</script>
