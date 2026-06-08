<template>
  <div class="register-icon-space">
    <div class="register-icon-space__logo">
      <main-logo />
    </div>
    <!-- register animation -->
    <div class="register-icon-space__animation">
      <div class="register-icon-space__animation__left">
        <typing-text
          class="typing-text"
          :words="[
            'Зарегистрируйся и получи курсы подготовки к ЕГЭ и ОГЭ <b>бесплатно</b>'
          ]"
          :speed="10"
          :back-delay="9337"
        />
        <span class="hint"> Прибавь от 20 баллов и выше </span>
      </div>
      <div class="register-icon-space__animation__right">
        <img
          :src="
            isMobile ? '/faces_register_mobile.svg' : '/facess_register.svg'
          "
          alt="Register Animation"
        />
      </div>
    </div>
    <div class="register-icon-space__blocks">
      <div class="register-icon-space__blocks__item">
        <h3 class="title">Русский язык</h3>
        <span class="tag"> ЕГЭ и 10 класс </span>
        <p>«Вся пунктуация»</p>

        <span class="tag oge"> ОГЭ </span>
        <p>«Задания №2 и №3»</p>
      </div>
      <div class="register-icon-space__blocks__item">
        <h3 class="title">Биология</h3>
        <span class="tag"> ЕГЭ и 10 класс </span>
        <p>«Задания №1 и №22»</p>

        <span class="tag oge"> ОГЭ </span>

        <p>«Нервная система»</p>
      </div>
      <div class="register-icon-space__blocks__item">
        <h3 class="title">Химия</h3>
        <span class="tag"> ЕГЭ и 10 класс </span>
        <p>«Задачи ЕГЭ по химии»</p>

        <span class="tag oge"> ОГЭ </span>

        <p>«Степень окисления»</p>
      </div>
      <div class="register-icon-space__blocks__item">
        <h3 class="title">Профиль</h3>
        <span class="tag"> ЕГЭ и 10 класс </span>
        <p>«№8 производные»</p>
      </div>
      <div class="register-icon-space__blocks__item">
        <h3 class="title">Физика</h3>
        <span class="tag"> ЕГЭ и 10 класс </span>
        <p>«Равноускоренное движение»</p>
      </div>
    </div>

    <div class="register-icon-space__help">
      <p>
        Возникли вопросы?
        <br class="register-icon-space__help__break" />
        Обратись к нам в
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
          href="https://t.me/noohelp_bot?start=platform"
        >
          Telegram
        </a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDevice } from '@/composables/useDevice'

const { isMobile } = useDevice()
</script>

<style lang="sass" scoped>
.register-icon-space
  padding: 2em
  max-height: 100vh
  overflow-y: auto

  &__logo
    @media screen and (max-width: 768px)
      text-align: center

  &__animation
    margin-top: 3em
    display: flex
    gap: 1em
    flex-direction: row

    @media screen and (max-width: 950px)
      font-size: 0.85em

    @media screen and (max-width: 950px)
      font-size: 0.85em
      text-align: center
      flex-direction: column

    &__left
      flex: 5

    &__right
      flex: 3
      display: flex
      justify-content: center
      align-items: center

    img
      max-width: 100%
      height: 200px

      @media screen and (max-width: 950px)
        height: auto
        max-width: 80%

    .typing-text
      margin-bottom: 1em
      font-size: 1.8em
      height: 150px

      @media screen and (max-width: 950px)
        height: 100px

      @media screen and (max-width: 500px)
        height: 90px
        font-size: 1.5em

    .hint
      background-color: var(--secondary)
      font-size: 1.2em
      font-weight: 500
      padding: 0.5em 1em
      border-radius: 200px
      white-space: nowrap

      @media screen and (max-width: 500px)
        font-size: 1em

  &__blocks
    display: flex
    flex-wrap: wrap
    gap: 0.7em
    margin-top: 60px
    margin-bottom: 2em

    @media screen and (max-width: 1350px)
      font-size: 0.9em
      margin-top: 50px

    @media screen and (max-width: 1350px)
      font-size: 0.8em
      margin-top: 40px

    @media screen and (max-width: 1050px)
      display: none

    &__item
      background-color: var(--lightest)
      border-radius: var(--border-radius)
      padding: 1em
      width: calc(20% - 0.8em)

      .title
        font-size: 1em
        margin-top: 0
        margin-bottom: 0.5em
        font-weight: 600

      .tag
        display: inline-block
        background-color: var(--primary)
        font-weight: 600
        padding: 0.2em 0.8em
        width: 100%
        border-radius: 50px
        font-size: 0.8em
        margin-bottom: 0.5em

        &.oge
          opacity: 0.8
          margin-top: 1.3em

      p
        font-size: 0.7em
        margin: 0
        height: 50px

  &__help
    @media screen and (max-width: 500px)
      font-size: 0.8em
      text-align: center

    &__break
      display: none

      @media screen and (max-width: 500px)
        display: inline
</style>
