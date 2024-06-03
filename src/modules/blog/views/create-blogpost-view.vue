<template>
  <div class="create-blogpost-view">
    <div class="create-blogpost-view__form">
      <div class="create-blogpost-view__form__title">
        <form-input
          type="text"
          v-model="createBlogpostStore.blogpost.title"
          label="Заголовок поста"
        />
      </div>
      <div class="create-blogpost-view__form__content">
        <rich-text-area
          :key="createBlogpostStore.blogpost.id"
          v-model="createBlogpostStore.blogpost.content"
          label="Содержание поста"
        />
      </div>
      <div class="create-blogpost-view__form__tags">
        <tag-input
          v-model="createBlogpostStore.blogpost.tags"
          label="Теги"
        />
      </div>
      <div
        v-if="createBlogpostStore.mode === 'create'"
        class="create-blogpost-view__form__poll"
        v-auto-animate
      >
        <div class="create-blogpost-view__form__poll__title">
          <h2>Опрос</h2>
        </div>
        <div
          class="create-blogpost-view__form__poll__form"
          v-if="createBlogpostStore.blogpost.poll"
        >
          <blogpost-poll-form v-model="createBlogpostStore.blogpost.poll" />
        </div>
        <common-button
          v-if="!createBlogpostStore.blogpost.poll"
          design="warning"
          @click="createBlogpostStore.addPoll()"
        >
          Добавить опрос
        </common-button>
        <common-button
          v-else
          design="danger"
          @click="createBlogpostStore.removePoll()"
        >
          Удалить опрос
        </common-button>
      </div>
      <div class="create-blogpost-view__form__actions">
        <div class="create-blogpost-view__form__actions__back">
          <common-button
            design="secondary"
            to="/blog"
          >
            Назад
          </common-button>
        </div>
        <div class="create-blogpost-view__form__actions__submit">
          <common-button
            design="primary"
            @click="createBlogpostStore.saveBlogpost()"
          >
            Сохранить
          </common-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BlogpostPollForm from '../components/blogpost-poll-form.vue'
import { useRoute } from 'vue-router'
import { useCreateBlogpostStore } from '../stores/create-blogpost'
import { onUnmounted, watch } from 'vue'
import { registerHotkeys } from '@/core/device/Hotkeys'
import { HOT_KEYS } from '../utils/hotkeys'

const createBlogpostStore = useCreateBlogpostStore()
const route = useRoute()

watch(
  () => route.params,
  (params) => {
    if (params.id && typeof params.id === 'string' && params.id.length > 0) {
      createBlogpostStore.fetchBlogpost(params.id as string)
      createBlogpostStore.setMode('edit')
    } else {
      createBlogpostStore.setMode('create')
      createBlogpostStore.reset()
    }
  },
  { immediate: true }
)

const unregister = registerHotkeys(HOT_KEYS)
onUnmounted(() => {
  unregister()
})
</script>

<style lang="sass" scoped>
.create-blogpost-view
  &__form
    display: flex
    flex-direction: column
    gap: 20px
    padding: 1em

    &__title
      width: 100%
      font-size: 1.4em

      @media (max-width: 768px)
        font-size: 1.2em

    &__content
      width: 100%

    &__actions
      display: flex
      justify-content: flex-end
      gap: 1em
</style>
