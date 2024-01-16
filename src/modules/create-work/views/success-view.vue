<template>
  <div class="success-view">
    <h1>
      Работа успешно
      {{
        $route.params.workSlug && $route.params.workSlug.length
          ? 'обновлена'
          : 'опубликована'
      }}!
    </h1>
    <common-button
      to="/works"
      alignment="center"
    >
      К списку работ
    </common-button>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="sass">
.success-view
  padding-top: 4rem
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
</style>
