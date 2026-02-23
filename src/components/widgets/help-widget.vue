<template>
  <div class="help-widget">
    <router-link
      to="/help"
      class="help-widget__button"
      title="Помощь и поддержка"
    >
      <inline-icon name="help" />
    </router-link>
  </div>
</template>

<style scoped lang="sass">
.help-widget
  position: relative

  &__button
    text-decoration: none
    color: var(--form-text-color)
    padding: 0.2em
    font-size: 1.6rem
    display: flex
    justify-content: center
    align-items: center
    border-radius: 0.5em
    background-color: transparent
    cursor: pointer
    border: none

    @media screen and (max-width: 768px)
      font-size: 1rem
      padding: 0.3em

    &:hover
      background-color: var(--light)
</style>
