<template>
  <div class="index-view">
    <div class="row">
      <div
        class="col-md-4"
        v-for="course in materialsStore.courses"
        :key="course.id"
      >
        <course-card
          :to="`/materials/${course.id}`"
          :image="course.image"
          :title="course.name"
          :description="course.description"
          :author="course.author.name"
          :author-avatar="course.author.avatar"
          :author-link="`/users/${course.author.id}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMaterialsStore } from '../stores/materials'

const materialsStore = useMaterialsStore()
</script>

<style scoped lang="sass">
.index-view
  padding: 1rem
</style>
