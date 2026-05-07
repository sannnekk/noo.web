<template>
  <div class="auth-icon-space">
    <div class="auth-icon-space__logo">
      <main-logo />
    </div>
    <div
      v-if="$route.name !== 'auth.register'"
      class="auth-icon-space__text"
    >
      <typing-text
        :words="[
          'Ты можешь поступить на бюджет туда, куда хочешь!',
          'Здесь заканчиваются твои проблемы в подготовке!',
          'Ты можешь больше! Ты можешь лучше!'
        ]"
        :speed="50"
      />
    </div>
    <div
      class="auth-icon-space__text-image"
      v-else
    >
      <img src="/login-heads-4.png" />
    </div>
    <div
      class="auth-icon-space__image"
      v-if="$route.name !== 'auth.register'"
    >
      <img
        src="/img/auth-icon-space.svg"
        alt="Auth Icon Space"
      />
    </div>
    <div class="auth-icon-space__help">
      <p>
        Возникли вопросы? Обратись к нам в
        <a
          target="blank"
          rel="noopener noreferrer"
          href="https://m.vk.com/mail?community=181180014"
        >
          VK
        </a>
        или
        <a
          target="blank"
          rel="noopener noreferrer"
          href="https://t.me/noohelp_bot"
        >
          Telegram
        </a>
      </p>
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

  &__text-image
    width: 100%
    height: auto
    margin-bottom: 4em
    padding: 0 2rem


    @media screen and (max-width: 768px)
      margin-bottom: 1em

    img
      width: 80%
      height: auto

      @media screen and (max-width: 768px)
        width: 100%

  &__image
    margin-bottom: 5em
    text-align: right

    img
      display: inline-block
      width: 95%
      margin-right: -2rem

  &__help
    margin-top: 3em
    text-align: left
    width: 100%
    padding: 0 2rem

    a
      font-weight: 600
      text-decoration: none

      &:hover
        text-decoration: underline
</style>
