<template>
  <div
    class="snippets-view"
    v-if="!snippetStore.moduleLoading"
  >
    <settings-section>
      <template #title> Мои сниппеты </template>
      <template #content>
        <snippet-list
          :snippets="snippetStore.snippets"
          @update="snippetStore.updateSnippet($event)"
          @delete="snippetStore.deleteSnippet($event)"
        />
      </template>
    </settings-section>
    <settings-section>
      <template #title> Создать сниппет </template>
      <template #content>
        <create-snippet-form
          @create-snippet="snippetStore.createSnippet($event)"
        />
      </template>
    </settings-section>
  </div>
  <div
    class="snippets-view__loading"
    v-else
  >
    <loader-icon contrast />
  </div>
</template>

<script lang="ts" setup>
import createSnippetForm from '../components/snippets/create-snippet-form.vue'
import SnippetList from '../components/snippets/snippet-list.vue'
import SettingsSection from '../components/settings-section.vue'
import { useSnippetStore } from '../stores/snippets'

const snippetStore = useSnippetStore()
snippetStore.fetchSnippets()
</script>

<style lang="sass" scoped>
.snippets-view
  &__loading
    display: flex
    justify-content: center
    align-items: center
    height: 500px
    font-size: 3em
</style>
