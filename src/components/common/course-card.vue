<template>
  <div class="course-card">
    <div class="course-card__img">
      <router-link
        class="router-link"
        :to="link"
      >
        <uploaded-image
          :src="courseImage"
          alt="Card title"
        />
      </router-link>
      <div class="course-card__img__more-widget">
        <more-widget :items="actions" />
      </div>
    </div>
    <div
      class="course-card__subject"
      v-if="course.subject"
    >
      <subject-name :subject="course.subject" />
    </div>
    <div class="course-card__title">
      <router-link :to="link">{{ course.name }}</router-link>
    </div>
    <div class="course-card__description">
      {{ course.description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { copyText } from '@/core/device/Clipboard'
import { Core } from '@/core/Core'
import { useRouter } from 'vue-router'
import { computed, reactive } from 'vue'
import type { MenuItem } from '../widgets/more-widget.vue'
import type { Course } from '@/core/data/entities/Course'
import type { CourseAssignment } from '@/core/data/entities/CourseAssignment'

interface Props {
  course: Course
  assignment?: CourseAssignment
}

interface Emits {
  (event: 'archive', assignment: CourseAssignment): void
  (event: 'unarchive', assignment: CourseAssignment): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const actions = reactive<MenuItem[]>([
  {
    title: 'Редактировать',
    icon: 'edit',
    if: Core.Context.roleIs(['teacher']),
    action: () => {
      router.push(`/create-course${props.course.slug}`)
    }
  },
  {
    title: 'Добавить/Убрать учеников',
    icon: 'user',
    if: Core.Context.roleIs(['teacher', 'admin']),
    action: () => {
      router.push(`/course-students/${props.course.slug}`)
    }
  },
  {
    title: 'Скопировать ссылку',
    icon: 'copy',
    stayOpened: true,
    action: function (selfRef: any) {
      copyCourseLink(selfRef)
    }
  },
  {
    title: 'Архивировать',
    icon: 'delete',
    if:
      Core.Context.roleIs(['student']) &&
      props.assignment &&
      !props.assignment?.isArchived,
    action: () => {
      archiveCourse()
    }
  },
  {
    title: 'Разархивировать',
    icon: 'check-green',
    if:
      Core.Context.roleIs(['student']) &&
      props.assignment &&
      props.assignment?.isArchived,
    action: () => {
      unarchiveCourse()
    }
  }
])

const router = useRouter()

const link = computed(() => `/courses/${props.course.slug}`)

const courseImage = computed(() => {
  return props.course.images[0]?.src || undefined
})

function copyCourseLink(thisRef: any) {
  copyText(`${Core.Constants.APP_URL}${link.value}`)

  thisRef.icon = 'check-green'
  thisRef.title = 'Скопировано'

  setTimeout(() => {
    thisRef.icon = 'copy'
    thisRef.title = 'Скопировать ссылку'
  }, 1000)
}

async function archiveCourse() {
  if (!props.assignment) {
    return
  }

  emits('archive', props.assignment)
}

async function unarchiveCourse() {
  if (!props.assignment) {
    return
  }

  emits('unarchive', props.assignment)
}
</script>

<style scoped lang="sass">
.course-card
  border-radius: var(--border-radius)
  border: 1px solid var(--border-color)
  padding: 1rem
  margin-bottom: 1rem
  transition: box-shadow 0.3s ease
  margin-bottom: 2em

  &:hover
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1)

  &__img
    width: 100%
    aspect-ratio: 1.5848
    overflow: hidden
    border-radius: var(--border-radius)
    margin-bottom: 1rem
    position: relative

    a
      display: block
      text-decoration: none
      width: 100%
      height: 100%
      overflow: hidden

      img
        width: 100%
        height: 100%
        object-fit: cover
        object-position: center

    &__more-widget
      position: absolute
      top: 10px
      right: 10px
      z-index: 1

  &__title
    font-size: 1.2rem
    font-weight: bold
    margin-bottom: 0.5rem

    a
      color: var(--text-dark)
      text-decoration: none

      &:hover
        color: var(--secondary)

  &__description
    margin-bottom: 0.8rem
    color: var(--text-light)
    font-size: 0.9em

  &__author
    display: flex
    flex-direction: row
    align-items: center

    &__avatar
      margin-right: 0.5rem
      font-size: 1.5em

    &__name
      font-size: 0.8rem

      a
        color: var(--text-light)
        text-decoration: none

        &:hover
          color: var(--secondary)

  &__edit
    margin-top: 1rem
    font-size: 0.8rem

    a
      color: var(--text-light)
      text-decoration: none

      &:hover
        color: var(--secondary)
</style>
