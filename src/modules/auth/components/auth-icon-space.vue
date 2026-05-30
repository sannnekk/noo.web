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
      <div class="auth-icon-space__text-image__inner">
        <typing-text
          :words="[
            'Зарегистрируйся и получи курс по заданиям №1 и №22 ЕГЭ по биологии <b>- прибавь ~10 баллов к результату!</b>'
          ]"
          :speed="10"
          :back-delay="12000"
        />
        <img
          src="/register_animation.svg"
          alt="Register Animation"
        />
      </div>
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
        Остались вопросы или не смог зарегистрироваться? Пиши нам в
        <a
          target="blank"
          rel="noopener noreferrer"
          href="https://vk.me/noobiology"
        >
          VK
        </a>
        или
        <a
          target="blank"
          rel="noopener noreferrer"
          href="https://t.me/noo_biobot?start=act_plat"
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
  justify-content: space-around
  padding: 120px 0 120px 0
  width: 100%
  height: 100%

  @media screen and (max-width: 768px)
    gap: 20px
    padding-top: 20px
    padding-bottom: 20px

  &__logo
    position: absolute
    top: 2rem
    left: 2rem

    @media screen and (max-width: 768px)
      position: static

    :deep() h1
      @media screen and (max-width: 768px)
        margin: 0
        padding-top: 0.5em

  &__text
    padding: 0 2rem
    width: 100%
    font-size: 40px
    height: 3em
    margin-bottom: 1em

    @media screen and (max-width: 768px)
      font-size: 20px
      min-height: 70px
      margin-bottom: 1em
      margin-top: 1em

    @media screen and (max-width: 500px)
      font-size: 17px
      padding-left: 15px
      padding-right: 15px
      text-align: center


  &__text-image
    width: 100%

    &__inner
      width: 100%
      display: flex
      flex-direction: row
      justify-content: space-around
      align-items: flex-start
      padding: 0 2rem
      margin-top: 2em
      height: 300px

      @media screen and (max-width: 768px)
        flex-direction: column
        align-items: center
        height: auto
        margin-top: 1em

      & > div
        width: 70%
        font-size: 35px
        padding-top: 20px

        @media screen and (max-width: 1000px)
          font-size: 20px
          padding-top: 10px

        @media screen and (max-width: 500px)
          font-size: 17px
          width: 100%
          height: 170px

      &:deep() b
        background-color: var(--secondary)
        font-weight: normal

      img
        width: 30%

        @media screen and (max-width: 500px)
          width: 70%

  &__image
    margin-bottom: 5em
    text-align: right

    @media screen and (max-width: 768px)
      margin-bottom: 0em

    img
      display: inline-block
      width: 95%
      margin-right: -2rem


      @media screen and (max-width: 768px)
        width: 100%
        margin-right: 0

  &__help
    margin-top: 0em
    margin-bottom: 3em
    text-align: left
    width: 100%
    padding: 0 2rem

    @media screen and (max-width: 768px)
      margin-top: 1em
      margin-bottom: 1em

    a
      font-weight: 600
      text-decoration: none

      &:hover
        text-decoration: underline
</style>
