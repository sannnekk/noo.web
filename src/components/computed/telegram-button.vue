<template>
  <common-button
    design="primary"
    :to="`https://t.me/${username}`"
  >
    {{ username }}
  </common-button>
</template>

<script setup lang="ts">
interface Props {
  username: string
}

const props = defineProps<Props>()
</script>
