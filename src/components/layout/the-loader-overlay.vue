<template>
  <Teleport to="body">
    <div class="loader-overlay">
      <loader-icon class="loader-overlay__icon" />
      <h2>Загрузка...</h2>
    </div>
  </Teleport>
</template>

<script setup lang="ts"></script>

<style scoped lang="sass">
.loader-overlay
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: #00000088
  z-index: 99999
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center

  &__icon
    display: block
    width: 1em
    height: 1em
    font-size: 100px

  h2
    color: #fff
    font-size: 1.8em
</style>
