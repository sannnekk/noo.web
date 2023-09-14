<template>
  <div class="logo">
    <img
      v-if="image"
      src="/assets/logo.png"
      alt="logo"
    />
    <h1
      v-else
      :class="{ dark }"
    >
      НОО.<span class="thin">Платформа</span>
    </h1>
  </div>
</template>

<script setup lang="ts">
interface Props {
  dark?: boolean
  image?: boolean
}

defineProps<Props>()
</script>

<style lang="sass" scoped>
.thin
  font-weight: 200
.logo
  color: var(--dark)

  &.dark
    color: var(--light)
</style>
