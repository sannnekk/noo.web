<template>
  <div class="course-card">
    <div class="course-card__img">
      <router-link
        class="router-link"
        :to="to"
      >
        <uploaded-image
          :src="image"
          alt="Card title"
        />
      </router-link>
      <div class="course-card__img__more-widget">
        <more-widget :items="actions" />
      </div>
    </div>
    <div class="course-card__title">
      <router-link :to="to">{{ title }}</router-link>
    </div>
    <div class="course-card__description">
      {{ description }}
    </div>
    <div
      class="course-card__author"
      v-if="author && showAuthor"
    >
      <div class="course-card__author__avatar">
        <user-avatar :name="author" />
      </div>
      <div class="course-card__author__name">
        <span>{{ author }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { copyText } from '@/core/device/Clipboard'
import { Core } from '@/core/Core'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'
import type { MenuItem } from '../widgets/more-widget.vue'

interface Props {
  image?: string | undefined
  title: string
  author?: string
  showAuthor?: boolean
  description: string
  slug: string
  to: string
}

const props = defineProps<Props>()

const actions = reactive<MenuItem[]>([
  {
    title: 'Добавить материал (Coming soon)',
    icon: 'add',
    if: Core.Context.User?.role === 'teacher',
    action: () => {}
  },
  {
    title: 'Редактировать',
    icon: 'edit',
    if: Core.Context.User?.role === 'teacher',
    action: () => {
      router.push(`/create-course${props.slug}`)
    }
  },
  {
    title: 'Скопировать ссылку',
    icon: 'copy',
    stayOpened: true,
    action: function (selfRef: any) {
      copyAction(selfRef, props.slug)
    }
  }
])

const router = useRouter()

function copyAction(thisRef: any, slug: string) {
  copyText(`${Core.Constants.APP_URL}/courses/${slug}`)

  thisRef.icon = 'check-green'
  thisRef.title = 'Скопировано'

  setTimeout(() => {
    thisRef.icon = 'copy'
    thisRef.title = 'Скопировать ссылку'
  }, 1000)
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
    height: 200px
    overflow: hidden
    border-radius: var(--border-radius)
    margin-bottom: 1rem

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
      top: 23px
      right: 40px
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
