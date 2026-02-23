<template>
  <section class="settings-section">
    <h3 class="settings-section__title">
      <slot name="title" />
    </h3>
    <div class="settings-section__content">
      <slot name="content" />
    </div>
  </section>
</template>

<style lang="sass" scoped>
.settings-section
  margin-bottom: 2em
</style>
