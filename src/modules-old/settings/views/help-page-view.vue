<template>
  <div class="help-page-view">
    <settings-section>
      <template #title>Статьи</template>
      <template #content>
        <div class="help-page-view__articles">
          <div class="help-page-view__articles__search">
            <search-field
              v-model="helpPageStore.articleSearch.pagination.search"
              :is-loading="helpPageStore.articleSearch.isListLoading"
            />
          </div>
          <div class="help-page-view__articles__list">
            <articles-table
              :articles="helpPageStore.articleSearch.results"
              @delete="helpPageStore.deleteArticle($event.id)"
            />
          </div>
          <div class="help-page-view__articles__pagination">
            <list-pagination
              v-model:page="helpPageStore.articleSearch.pagination.page"
              :total="helpPageStore.articleSearch.resultsMeta.total"
              :limit="helpPageStore.articleSearch.pagination.limit"
            />
          </div>
        </div>
      </template>
    </settings-section>
    <settings-section>
      <template #title>Создать статью</template>
      <template #content>
        <create-article-form
          @create-article="helpPageStore.createArticle($event)"
        />
      </template>
    </settings-section>
    <settings-section>
      <template #title>Категории</template>
      <template #content>
        <categories-table
          :categories="helpPageStore.categoryTree"
          @edit="helpPageStore.updateCategory($event)"
          @delete="helpPageStore.deleteCategory($event.id)"
        />
      </template>
    </settings-section>
    <settings-section>
      <template #title>Добавить категорию</template>
      <template #content>
        <create-category-form
          @create-category="helpPageStore.createCategory($event)"
        />
      </template>
    </settings-section>
  </div>
</template>

<script lang="ts" setup>
import createCategoryForm from '../components/help-page/create-category-form.vue'
import createArticleForm from '../components/help-page/create-article-form.vue'
import articlesTable from '../components/help-page/articles-table.vue'
import categoriesTable from '../components/help-page/categories-table.vue'
import SettingsSection from '../components/settings-section.vue'
import { useHelpPageStore } from '../stores/help-page'

const helpPageStore = useHelpPageStore()
helpPageStore.fetchCategoryTree()
</script>
