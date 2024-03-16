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
    </div>
    <div class="course-card__title">
      <router-link :to="to">{{ title }}</router-link>
    </div>
    <div class="course-card__description">
      {{ description }}
    </div>
    <div
      class="course-card__author"
      v-if="author && authorLink"
    >
      <div class="course-card__author__avatar">
        <user-avatar :name="author" />
      </div>
      <div class="course-card__author__name">
        <span>{{ author }}</span>
      </div>
    </div>
    <div
      class="course-card__edit"
      v-if="Core.Context.User?.role === 'teacher'"
    >
      <router-link :to="`/create-course${slug}`"> Редактировать </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Core } from '@/core/Core'

interface Props {
  image: string
  title: string
  author?: string
  description: string
  authorAvatar?: string
  authorLink?: string
  slug: string
  to: string
}

defineProps<Props>()
</script>

<style scoped lang="sass">
.course-card
  border-radius: var(--border-radius)
  border: 1px solid var(--border-color)
  padding: 1rem
  margin-bottom: 1rem
  transition: box-shadow 0.3s ease

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
