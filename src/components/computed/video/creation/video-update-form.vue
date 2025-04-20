<template>
  <div class="video-update-form">
    <div class="form-group">
      <form-input
        label="Название"
        v-model="videoModel.title"
        type="text"
        :validators="[
				(value) => (value as string).length > 0 || 'Введите название видео',
				(value) => (value as string).length <= 100 || 'Название не должно превышать 100 символов'
			]"
      />
    </div>
    <div class="form-group">
      <file-input
        v-model="thumbnailModel"
        label="Превью-изображение"
        :max-count="1"
        :allowed-mime-types="['image/jpeg', 'image/png']"
      />
    </div>
    <div class="form-group">
      <rich-text-area
        label="Описание"
        v-model="videoModel.description"
      />
    </div>
    <div class="form-group">
      <div class="row">
        <div class="col-lg-4">
          <form-input
            label="Дата публикации"
            v-model="videoModel.publishedAt"
            type="date"
          />
        </div>
        <div
          class="col-lg-4"
          v-if="Core.Context.roleIs(['admin', 'teacher'])"
        >
          <select-input
            label="Видео доступно"
            v-model="videoModel.accessType"
            :options="videoAccessTypes"
          />
        </div>
        <div
          class="col-lg-4"
          v-if="Core.Context.roleIs(['admin', 'teacher'])"
        >
          <courses-select
            v-if="videoModel.accessType === 'courseId'"
            label="Курс"
            :max-count="10"
            v-model="accessValueModel as any"
          />
          <user-role-select
            v-else-if="videoModel.accessType === 'role'"
            label="Роль"
            v-model="accessValueModel as any"
          />
        </div>
      </div>
    </div>
    <div
      class="form-group error-block"
      v-auto-animate
    >
      <error-block v-if="error">
        {{ error }}
      </error-block>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Course } from '@/core/data/entities/Course'
import type { User } from '@/core/data/entities/User'
import type { Video } from '@/core/data/entities/Video'
import { Core } from '@/core/Core'
import type { Media } from '@/core/data/entities/Media'

interface Props {
  video: Video
  valid: boolean
}

interface Emits {
  (event: 'submit'): void
  (event: 'update:valid', value: boolean): void
  (event: 'update:video', value: Video): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const videoModel = computed({
  get: () => props.video,
  set: (value: Video) => emits('update:video', value)
})

const thumbnailModel = ref<Media[]>(
  props.video.thumbnail ? [props.video.thumbnail] : []
)

watch(thumbnailModel, (value) => {
  videoModel.value.thumbnail = value[0] || null
})

const accessValueModel = ref<Course[] | { value: User['role'] } | null>(null)

watch(accessValueModel, (value) => {
  switch (videoModel.value.accessType) {
    case 'courseId':
      videoModel.value.accessValue = (value as Course[])
        .map((course) => course.id)
        .join(',')
      break
    case 'role':
      videoModel.value.accessValue =
        (value as { value: User['role'] })?.value || 'student'
      break
    case 'everyone':
    default:
      videoModel.value.accessValue = null
      break
  }
})

watch(
  () => videoModel.value.accessType,
  () => {
    switch (videoModel.value.accessType) {
      case 'role':
        videoModel.value.accessValue = 'student'
        break
      case 'courseId':
      case 'everyone':
      default:
        videoModel.value.accessValue = null
        break
    }
  }
)

const videoAccessTypes: { value: string; label: string }[] = [
  { value: 'everyone', label: 'Всем' },
  { value: 'courseId', label: 'Участникам курса' },
  { value: 'role', label: 'По роли' }
]

const error = ref<string | null>(null)

function validateVideoData() {
  if (!videoModel.value.title.length || videoModel.value.title.length > 100) {
    error.value = 'Название не должно быть пустым или превышать 100 символов'
    return false
  }

  if (!videoModel.value.serviceType) {
    error.value = 'Выберите сервис для загрузки видео'
    return false
  }

  error.value = null
  return true
}

watch(
  () => videoModel.value,
  () => {
    if (!validateVideoData()) {
      emits('update:valid', false)
      return
    }

    emits('update:valid', true)
  },
  { immediate: true, deep: true }
)
</script>

<style scoped lang="sass">
.error-block
	margin-top: 1em
	font-size: 0.9em
</style>
