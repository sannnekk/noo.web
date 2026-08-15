<template>
  <ul class="auth-form-links">
    <li
      class="auth-form-links__item"
      v-for="link in links"
      :key="link.to"
    >
      <router-link :to="link.to">{{ link.label }}</router-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
interface Props {
  links: { to: string; label: string }[]
}

defineProps<Props>()
</script>

<style lang="sass" scoped>
.auth-form-links
  display: flex
  flex-direction: column
  align-items: center
  gap: 0.5rem
  margin: 0
  padding: 0
  list-style: none
  text-align: center

  a
    text-decoration: underline
</style>
