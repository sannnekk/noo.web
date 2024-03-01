<template>
  <common-button
    design="telegram"
    alignment="stretch"
    :to="`https://t.me/${username}`"
  >
    {{ username }}
  </common-button>
</template>

<script setup lang="ts">
interface Props {
  username: string
}

defineProps<Props>()
</script>
