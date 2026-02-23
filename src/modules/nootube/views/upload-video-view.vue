<template>
  <div class="upload-video-view">
    <video-creation-form @uploaded="onUploaded($event)" />
  </div>
</template>

<script setup lang="ts">
import type { Video } from '@/core/data/entities/Video'

function onUploaded(video: Video) {}
</script>

<style scoped lang="sass"></style>
