<template>
  <div class="file-list">
    <div class="file-list__label">
      <h3>{{ label }}</h3>
    </div>
    <div class="file-list__files">
      <div
        class="file-list__files__file"
        v-for="file in files"
      >
        <a
          :href="file"
          target="_blank"
        >
          {{ file }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  files: string[]
}

defineProps<Props>()
</script>

<style scoped lang="sass"></style>
