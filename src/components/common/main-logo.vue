<template>
  <div class="logo">
    <h1 :class="{ dark }">НОО.<span class="thin">Платформа</span></h1>
  </div>
</template>

<script setup lang="ts">
interface Props {
  dark?: boolean
}

defineProps<Props>()
</script>

<style lang="sass" scoped>
.thin
  font-weight: 200
.logo
  color: var(--form-text-color)

  &.dark
    color: var(--form-text-color)
</style>
