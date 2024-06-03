<template>
  <div class="index-view">
    <div class="index-view__search">
      <div class="index-view__search__field">
        <search-field v-model="blogStore.pagination.search" />
      </div>
      <div class="index-view__search__add-post">
        <common-button
          v-if="
            Core.Context.User?.role === 'admin' ||
            Core.Context.User?.role === 'teacher'
          "
          design="primary"
          to="/blog/post/create"
        >
          Добавить пост
        </common-button>
      </div>
    </div>
    <the-sidebar-layout>
      <template #sidebar>
        <blogpost-search-options v-model:pagination="blogStore.pagination" />
      </template>
      <template #content>
        <div class="index-view__list">
          <blogpost-list
            :posts="blogStore.results"
            :loading="blogStore.isListLoading"
            :is-reaction-loading="blogStore.isReactionLoading"
            @react="blogStore.reactToPost($event.postId, $event.reaction)"
            @delete="onPostDelete($event)"
          />
        </div>
        <div
          class="index-view__pagination"
          v-if="blogStore.pagination?.page && blogStore.pagination?.limit"
        >
          <list-pagination
            v-model:page="blogStore.pagination.page"
            :total="blogStore.resultsMeta.total"
            :limit="blogStore.pagination.limit"
          />
        </div>
      </template>
    </the-sidebar-layout>
  </div>
  <sure-modal
    v-model:visible="deleteModal.isDeleteModalVisible"
    @confirm="blogStore.deletePost(deleteModal.postIdToDelete)"
  >
    <template #title>Удаление поста</template>
    <template #text>
      Вы уверены, что хотите удалить пост "{{ deleteModal.postTitle }}"?
    </template>
  </sure-modal>
</template>

<script lang="ts" setup>
import BlogpostSearchOptions from '../components/blogpost-search-options.vue'
import BlogpostList from '../components/blogpost-list.vue'
import { Core } from '@/core/Core'
import { useBlogStore } from '../stores/blog'
import { setPageTitle } from '@/core/utils/setPageTitle'
import { reactive } from 'vue'

const blogStore = useBlogStore()

const deleteModal = reactive({
  isDeleteModalVisible: false,
  postIdToDelete: '',
  postTitle: ''
})

function onPostDelete(postId: string) {
  deleteModal.isDeleteModalVisible = true
  deleteModal.postIdToDelete = postId
  deleteModal.postTitle =
    blogStore.results.find((post) => post.id === postId)?.title || ''
}

setPageTitle('Блог/Новости')
</script>

<style lang="sass" scoped>
.index-view
	&__search
		padding: 1em
		display: flex
		gap: 1em

		@media screen and (max-width: 768px)
			flex-direction: column

		&__field
			flex: 1
</style>
