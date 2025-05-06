<template>
  <router-view v-slot="{ Component, route }">
    <transition
      enter-active-class="enterClass"
      leave-active-class="leaveClass"
      mode="out-in"
    >
      <component
        :is="Component"
        :key="route.fullPath"
        class="animate__animated"
      />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style scoped src="animate.css"></style>
