<template>
  <div class="pdf-preview">
    <embed
      :src="src"
      type="application/pdf"
      width="100%"
      height="100%"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string
}

defineProps<Props>()
</script>
