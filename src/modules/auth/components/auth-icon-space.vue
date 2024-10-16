<template>
  <div class="auth-icon-space">
    <div class="auth-icon-space__logo">
      <main-logo />
    </div>
    <div class="auth-icon-space__text">
      <typing-text
        :words="[
          'Ты можешь поступить на бюджет туда, куда хочешь!',
          'Здесь заканчиваются твои проблемы в подготовке!',
          'Ты можешь больше! Ты можешь лучше!'
        ]"
        :speed="50"
      />
    </div>
    <div class="auth-icon-space__image">
      <img
        src="/img/auth-icon-space.svg"
        alt="Auth Icon Space"
      />
    </div>
  </div>
</template>

<style lang="sass" scoped>
.auth-icon-space
  position: relative
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  width: 100%
  height: 100%

  @media screen and (max-width: 768px)
    justify-content: flex-end
    gap: 2em

  &__logo
    position: absolute
    top: 2rem
    left: 2rem

  &__text
    padding: 0 2rem
    width: 100%
    font-size: 40px
    height: 3em

    @media screen and (max-width: 768px)
      font-size: 20px

  &__image
    margin-top: 5%
    text-align: right

    img
      display: inline-block
      width: 95%
      margin-right: -2rem
</style>
