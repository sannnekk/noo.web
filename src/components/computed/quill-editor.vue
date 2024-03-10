<template>
  <div ref="container"></div>
</template>

<script setup lang="ts">
import type { DeltaContentType } from '@/types/composed/DeltaContentType'
import { onMounted, ref } from 'vue'
import { Core } from '@/core/Core'

// Quill
import Quill from 'quill'
import { Delta } from 'quill/core'
import 'quill/dist/quill.snow.css'
// @ts-ignore
import ImageUploader from 'quill-image-uploader'

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

onMounted(() => initQuill())

function initQuill() {
  // modules
  Quill.register(
    {
      'modules/image-uploader': ImageUploader
    },
    true
  )

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
          ],
          'image-uploader': {
            upload: (file: File) => {
              console.log('UPLOAD', file)
              return new Promise((resolve, reject) => {
                Core.Services.Media.upload([file])
                  .then((res) => {
                    resolve(Core.Constants.MEDIA_URL + '/' + res.data?.links[0])
                  })
                  .catch((err) => {
                    Core.Services.UI.openErrorModal(
                      'Не удалось загрузить изображение',
                      err.message
                    )
                    reject(err)
                  })
              })
            }
          }
        }
  })

  quill.setContents(new Delta(props.modelValue))
  quill.on('text-change', () => {
    emits('update:modelValue', quill!.getContents())
  })
}
</script>
