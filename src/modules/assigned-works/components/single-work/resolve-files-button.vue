<template>
  <common-button
    design="inline"
    alignment="stretch"
    @click="resolveFiles()"
  >
    Конвертировать файлы
  </common-button>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'
import type { Answer } from '@/core/data/entities/Answer'
import type { AssignedWork } from '@/core/data/entities/AssignedWork'
import type { Media } from '@/core/data/entities/Media'
import type { DeltaContentType } from '@/types/richtext/DeltaContentType'

interface Props {
  answers: (Answer | undefined | null)[]
  studentComment?: DeltaContentType | null
  assignedWorkId: AssignedWork['id']
}

interface Emits {
  (event: 'update:answers', value: (Answer | undefined | null)[]): void
  (event: 'update:studentComment', value: DeltaContentType | null): void
}

type FileItems = Record<string, { dataUrl: string; file: File; url?: string }[]>

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const uiService = Core.Services.UI
const assignedWorkService = Core.Services.AssignedWork
const mediaService = Core.Services.Media

async function resolveFiles() {
  uiService.setLoading(true)

  const fileItems = props.answers.reduce((acc, answer) => {
    if (!answer || !answer.content) return acc

    const dataUrls = getDataUrlsFromDelta(answer.content)

    if (!dataUrls.length) return acc

    const data = dataUrls.map((dataUrl) => ({
      dataUrl,
      file: dataUrlToFile(dataUrl)
    }))

    if (acc[answer.id]) {
      acc[answer.id].push(...data)
    } else {
      acc[answer.id] = data
    }

    return acc
  }, {} as FileItems)

  const files = Object.values(fileItems).flatMap((items) =>
    items.map((item) => item.file)
  )

  if (props.studentComment) {
    const dataUrls = getDataUrlsFromDelta(props.studentComment)

    if (dataUrls.length) {
      const data = dataUrls.map((dataUrl) => ({
        dataUrl,
        file: dataUrlToFile(dataUrl)
      }))

      fileItems['studentComment'] = data
      files.push(...data.map((item) => item.file))
    }
  }

  if (!files.length) {
    uiService.setLoading(false)
    uiService.openWarningModal('Нет файлов для загрузки')
    return
  }

  try {
    const responses = await Promise.all(
      files.map((file) => mediaService.upload([file]))
    )
    const uploadedMedia = responses
      .flatMap((res) => res.data)
      .filter(Boolean) as Media[]

    if (uploadedMedia?.length !== files.length) {
      throw new Error('Не все файлы удалось загрузить')
    }

    for (const media of uploadedMedia) {
      const filename = media.name
      const fileItem = Object.values(fileItems).find((items) =>
        items.some((item) => item.file.name === filename)
      )

      if (!fileItem) {
        continue
      }

      for (const item of fileItem) {
        if (item.file.name === filename) {
          item.url = Core.Constants.MEDIA_URL + '/' + media.src
        }
      }
    }
  } catch (error: any) {
    uiService.setLoading(false)
    uiService.openErrorModal('Часть файлов не удалось загрузить', error.message)
    return
  }

  const resolvedAnswers = replaceDataUrlsWithUrls(props.answers, fileItems)
  const resolvedStudentComment = replaceDataUrlsWithUrlsInComment(
    props.studentComment || null,
    fileItems
  )

  try {
    await assignedWorkService.saveAssignedWorkProgress(props.assignedWorkId, {
      answers: resolvedAnswers,
      studentComment: resolvedStudentComment
    })
  } catch (error: any) {
    uiService.openErrorModal('Не удалось сохранить ответы', error.message)
    return
  }

  emits('update:answers', resolvedAnswers)

  if (resolvedStudentComment) {
    emits('update:studentComment', resolvedStudentComment)
  }

  uiService.openSuccessModal('Файлы успешно конвертированы')
  uiService.setLoading(false)
}

function getDataUrlsFromDelta(delta: DeltaContentType | null): string[] {
  if (!delta) return []

  const dataUrls: string[] = []

  delta.ops.forEach((op) => {
    if (isDataUrl(op.insert)) {
      dataUrls.push(op.insert.image)
    }
  })

  return dataUrls
}

function dataUrlToFile(dataUrl: string): File {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])

  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  const random = Math.random().toString(36).substring(10)
  const filename = 'file-' + random + '.' + mime.split('/')[1]

  return new File([u8arr], filename, { type: mime })
}

function replaceDataUrlsWithUrls(
  answers: (Answer | undefined | null)[],
  fileItems: FileItems
): Answer[] {
  return answers
    .map((answer) => {
      if (!answer?.content) {
        return answer
      }

      const content = { ...answer.content }

      for (const op of content.ops) {
        if (!isDataUrl(op.insert)) {
          continue
        }

        const dataUrl = op.insert.image
        const fileItem = Object.values(fileItems).find((items) =>
          items.some((item) => item.dataUrl === dataUrl)
        )

        if (fileItem) {
          const url = fileItem.find((item) => item.dataUrl === dataUrl)?.url

          if (url) {
            op.insert.image = url
          }
        }
      }

      return { ...answer, content }
    })
    .filter(Boolean) as Answer[]
}

function replaceDataUrlsWithUrlsInComment(
  comment: DeltaContentType | null,
  fileItems: FileItems
): DeltaContentType | null {
  if (!comment) return null

  const content = { ...comment }

  for (const op of content.ops) {
    if (!isDataUrl(op.insert)) {
      continue
    }

    const dataUrl = op.insert.image
    const fileItem = Object.values(fileItems).find((items) =>
      items.some((item) => item.dataUrl === dataUrl)
    )

    if (fileItem) {
      const url = fileItem.find((item) => item.dataUrl === dataUrl)?.url

      if (url) {
        op.insert.image = url
      }
    }
  }

  return content
}

function isDataUrl(insert: any): insert is { image: string } {
  return (
    typeof insert === 'object' &&
    insert.image &&
    typeof insert.image === 'string' &&
    insert.image.startsWith('data:')
  )
}
</script>

<style scoped></style>
